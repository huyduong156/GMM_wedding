import { randomUUID } from 'node:crypto'
import type { PrismaClient, MusicTrackScope, MusicTrackStatus } from '@prisma/client'
import type { ObjectStorage } from '@/platform/storage/object-storage'

const MAX_AUDIO_BYTES = 15 * 1024 * 1024
const MIME_EXT: Record<string, string> = {
  'audio/mpeg': 'mp3',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
}
const READY_SYSTEM: MusicTrackStatus = 'READY'
export class MusicError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'MusicError'
  }
}

export type MusicTrackView = {
  id: string
  scope: MusicTrackScope
  status: MusicTrackStatus
  displayName: string
  artistName: string | null
  durationSeconds: number | null
  mimeType: string
  sizeBytes: number
  licenseType: string | null
  licenseReference: string | null
  creditText: string | null
  revision: number
  playbackUrl: string | null
  createdAt: Date
  updatedAt: Date
}
type CreateInput = {
  displayName: string
  artistName?: string | undefined
  mimeType: string
  sizeBytes: number
  licenseType?: string | undefined
  licenseReference?: string | undefined
  creditText?: string | undefined
}
type ListInput = { q?: string | undefined; includeRetired?: boolean | undefined }

export class MusicService {
  constructor(
    private readonly prisma: PrismaClient,
    private readonly storage: ObjectStorage,
  ) {}

  async listForUser(userId: string, input: ListInput = {}) {
    const rows = await this.prisma.musicTrack.findMany({
      where: {
        OR: [
          { scope: 'SYSTEM', status: READY_SYSTEM },
          { scope: 'PERSONAL', ownerUserId: userId, status: READY_SYSTEM },
        ],
        ...(input.includeRetired
          ? { OR: [{ scope: 'SYSTEM' }, { scope: 'PERSONAL', ownerUserId: userId }] }
          : {}),
        ...(input.q
          ? {
              AND: [
                {
                  OR: [
                    { displayName: { contains: input.q, mode: 'insensitive' } },
                    { artistName: { contains: input.q, mode: 'insensitive' } },
                  ],
                },
              ],
            }
          : {}),
      },
      orderBy: [{ scope: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { items: rows.map((row) => this.view(row)) }
  }

  async getForUser(userId: string, trackId: string) {
    const row = await this.prisma.musicTrack.findFirst({
      where: {
        id: trackId,
        OR: [
          { scope: 'SYSTEM', status: READY_SYSTEM },
          { scope: 'PERSONAL', ownerUserId: userId, status: READY_SYSTEM },
        ],
      },
    })
    if (!row) throw new MusicError('MUSIC_TRACK_NOT_FOUND', 404, 'Music track not found')
    return { track: this.view(row) }
  }

  async createPersonalIntent(userId: string, input: CreateInput) {
    return this.createIntent(userId, 'PERSONAL', input)
  }

  async createAdminIntent(adminUserId: string, input: CreateInput) {
    if (!input.licenseType || !input.licenseReference)
      throw new MusicError(
        'MUSIC_LICENSE_REQUIRED',
        400,
        'System music requires license information',
      )
    return this.createIntent(adminUserId, 'SYSTEM', input)
  }

  private async createIntent(userId: string, scope: MusicTrackScope, input: CreateInput) {
    this.validateInput(input)
    const id = randomUUID()
    const key = 'music/' + scope.toLowerCase() + '/' + id + '.' + MIME_EXT[input.mimeType]
    const upload = await this.storage.createUploadIntent(key, input.mimeType, input.sizeBytes)
    const row = await this.prisma.musicTrack.create({
      data: {
        id,
        ownerUserId: scope === 'PERSONAL' ? userId : null,
        createdById: userId,
        scope,
        status: 'DRAFT',
        displayName: input.displayName.trim(),
        artistName: input.artistName?.trim() || null,
        mimeType: input.mimeType,
        sizeBytes: input.sizeBytes,
        storageKey: key,
        licenseType: input.licenseType ?? null,
        licenseReference: input.licenseReference ?? null,
        creditText: input.creditText?.trim() || null,
      },
    })
    return { track: this.view(row), upload }
  }

  async complete(userId: string, trackId: string, scope: MusicTrackScope) {
    const row = await this.findOwnedUpload(userId, trackId, scope)
    const stored = await this.storage.head(row.storageKey)
    if (!stored)
      throw new MusicError('MUSIC_UPLOAD_INCOMPLETE', 409, 'Music upload has not completed')
    if (
      stored.sizeBytes !== Number(row.sizeBytes) ||
      stored.sizeBytes > MAX_AUDIO_BYTES ||
      (stored.mimeType !== 'application/octet-stream' && stored.mimeType !== row.mimeType)
    )
      throw new MusicError(
        'MUSIC_INVALID_OBJECT',
        400,
        'Uploaded object does not match the requested music track',
      )
    const updated = await this.prisma.musicTrack.update({
      where: { id: row.id },
      data: { status: 'READY' },
    })
    return { track: this.view(updated) }
  }

  async activate(adminUserId: string, trackId: string) {
    const row = await this.prisma.musicTrack.findFirst({ where: { id: trackId, scope: 'SYSTEM' } })
    if (!row) throw new MusicError('MUSIC_TRACK_NOT_FOUND', 404, 'Music track not found')
    if (!row.licenseType || !row.licenseReference)
      throw new MusicError(
        'MUSIC_LICENSE_REQUIRED',
        400,
        'System music requires license information',
      )
    const stored = await this.storage.head(row.storageKey)
    if (!stored)
      throw new MusicError('MUSIC_UPLOAD_INCOMPLETE', 409, 'Music upload has not completed')
    const updated = await this.prisma.musicTrack.update({
      where: { id: row.id },
      data: { status: 'READY' },
    })
    return { track: this.view(updated) }
  }

  async updateAdmin(
    adminUserId: string,
    trackId: string,
    input: {
      displayName?: string | undefined
      artistName?: string | null | undefined
      licenseType?: string | null | undefined
      licenseReference?: string | null | undefined
      creditText?: string | null | undefined
      sortOrder?: number | undefined
      revision: number
    },
  ) {
    void adminUserId
    const row = await this.prisma.musicTrack.findFirst({ where: { id: trackId, scope: 'SYSTEM' } })
    if (!row) throw new MusicError('MUSIC_TRACK_NOT_FOUND', 404, 'Music track not found')
    const licenseType = input.licenseType !== undefined ? input.licenseType : row.licenseType
    const licenseReference =
      input.licenseReference !== undefined ? input.licenseReference : row.licenseReference
    if (!licenseType || !licenseReference)
      throw new MusicError(
        'MUSIC_LICENSE_REQUIRED',
        400,
        'System music requires license information',
      )
    const updated = await this.prisma.musicTrack.updateMany({
      where: { id: trackId, scope: 'SYSTEM', revision: input.revision },
      data: {
        ...(input.displayName !== undefined ? { displayName: input.displayName.trim() } : {}),
        ...(input.artistName !== undefined ? { artistName: input.artistName?.trim() || null } : {}),
        ...(input.licenseType !== undefined
          ? { licenseType: input.licenseType?.trim() || null }
          : {}),
        ...(input.licenseReference !== undefined
          ? { licenseReference: input.licenseReference?.trim() || null }
          : {}),
        ...(input.creditText !== undefined ? { creditText: input.creditText?.trim() || null } : {}),
        ...(input.sortOrder !== undefined ? { sortOrder: input.sortOrder } : {}),
        revision: { increment: 1 },
      },
    })
    if (updated.count !== 1)
      throw new MusicError(
        'MUSIC_REVISION_CONFLICT',
        409,
        'Music track has changed; reload before updating',
      )
    const result = await this.prisma.musicTrack.findUnique({ where: { id: trackId } })
    if (!result) throw new MusicError('MUSIC_TRACK_NOT_FOUND', 404, 'Music track not found')
    return { track: this.view(result) }
  }
  async listAdmin(input: ListInput = {}) {
    const rows = await this.prisma.musicTrack.findMany({
      where: {
        ...(input.q
          ? {
              OR: [
                { displayName: { contains: input.q, mode: 'insensitive' } },
                { artistName: { contains: input.q, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: [{ status: 'asc' }, { sortOrder: 'asc' }, { createdAt: 'desc' }],
    })
    return { items: rows.map((row) => this.view(row)) }
  }

  async retire(userId: string, trackId: string) {
    const row = await this.prisma.musicTrack.findFirst({
      where: { id: trackId, scope: 'PERSONAL', ownerUserId: userId, status: { not: 'RETIRED' } },
    })
    if (!row) throw new MusicError('MUSIC_TRACK_NOT_FOUND', 404, 'Music track not found')
    const updated = await this.prisma.musicTrack.update({
      where: { id: row.id },
      data: { status: 'RETIRED', retiredAt: new Date(), revision: { increment: 1 } },
    })
    return { track: this.view(updated) }
  }

  async retireAdmin(adminUserId: string, trackId: string) {
    const row = await this.prisma.musicTrack.findFirst({
      where: { id: trackId, scope: 'SYSTEM', status: { not: 'RETIRED' } },
    })
    if (!row) throw new MusicError('MUSIC_TRACK_NOT_FOUND', 404, 'Music track not found')
    const updated = await this.prisma.musicTrack.update({
      where: { id: row.id },
      data: { status: 'RETIRED', retiredAt: new Date(), revision: { increment: 1 } },
    })
    return { track: this.view(updated) }
  }

  private async findOwnedUpload(userId: string, trackId: string, scope: MusicTrackScope) {
    const row = await this.prisma.musicTrack.findFirst({
      where: { id: trackId, scope, ...(scope === 'PERSONAL' ? { ownerUserId: userId } : {}) },
    })
    if (!row) throw new MusicError('MUSIC_TRACK_NOT_FOUND', 404, 'Music track not found')
    return row
  }

  private validateInput(input: CreateInput) {
    if (!MIME_EXT[input.mimeType] || input.sizeBytes < 1 || input.sizeBytes > MAX_AUDIO_BYTES)
      throw new MusicError(
        'MUSIC_INVALID_INPUT',
        400,
        'Only audio/mpeg, audio/mp4 and audio/ogg up to 15MB are supported',
      )
    if (input.displayName.trim().length < 1 || input.displayName.length > 160)
      throw new MusicError('MUSIC_INVALID_INPUT', 400, 'Music display name is required')
  }

  private view(row: {
    id: string
    scope: MusicTrackScope
    status: MusicTrackStatus
    displayName: string
    artistName: string | null
    durationSeconds: number | null
    mimeType: string
    sizeBytes: bigint
    licenseType: string | null
    licenseReference: string | null
    creditText: string | null
    revision: number
    storageKey: string
    createdAt: Date
    updatedAt: Date
  }): MusicTrackView {
    return {
      id: row.id,
      scope: row.scope,
      status: row.status,
      displayName: row.displayName,
      artistName: row.artistName,
      durationSeconds: row.durationSeconds,
      mimeType: row.mimeType,
      sizeBytes: Number(row.sizeBytes),
      licenseType: row.licenseType,
      licenseReference: row.licenseReference,
      creditText: row.creditText,
      revision: row.revision,
      playbackUrl: row.status === 'READY' ? this.storage.publicUrl(row.storageKey) : null,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }
}
