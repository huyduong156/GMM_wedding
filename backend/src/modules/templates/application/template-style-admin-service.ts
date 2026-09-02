import { Prisma, type PrismaClient } from '@prisma/client'
import type { PlatformAdminActor } from '@/platform/auth/actor-context'
import { TemplateAdminError } from '../domain/template-admin-error'
import type { CreateTemplateStyle, UpdateTemplateStyle } from '../interface/template-style-schemas'

type Db = PrismaClient | Prisma.TransactionClient
type StyleRow = { id: string; key: string; name: string; description: string | null; sortOrder: number; status: 'ACTIVE' | 'ARCHIVED'; createdAt: Date; updatedAt: Date; templateCount?: bigint }

function dto(row: StyleRow) {
  return { id: row.id, key: row.key, name: row.name, description: row.description, sortOrder: row.sortOrder, status: row.status, templateCount: Number(row.templateCount ?? 0), createdAt: row.createdAt, updatedAt: row.updatedAt }
}

function duplicate(error: unknown) { return error instanceof Error && 'code' in error && (error as { code?: string }).code === 'P2002' }

export class TemplateStyleAdminService {
  constructor(private readonly db: PrismaClient) {}

  async listActive() {
    const rows = await this.db.$queryRaw<StyleRow[]>`SELECT * FROM "TemplateStyle" WHERE status = 'ACTIVE' ORDER BY "sortOrder" ASC, name ASC`
    return { items: rows.map(dto) }
  }

  async list(includeArchived = true) {
    const rows = await this.db.$queryRaw<StyleRow[]>`
      SELECT s.*, COUNT(a."templateId")::bigint AS "templateCount"
      FROM "TemplateStyle" s
      LEFT JOIN "TemplateStyleAssignment" a ON a."styleId" = s.id
      ${includeArchived ? Prisma.sql`` : Prisma.sql`WHERE s.status = 'ACTIVE'`}
      GROUP BY s.id ORDER BY s."sortOrder" ASC, s.name ASC`
    return { items: rows.map(dto) }
  }

  async create(actor: PlatformAdminActor, data: CreateTemplateStyle, requestId: string) {
    try {
      const row = await this.db.$queryRaw<StyleRow[]>`
        INSERT INTO "TemplateStyle" (id, key, name, description, "sortOrder", status, "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${data.key}, ${data.name}, ${data.description ?? null}, ${data.sortOrder ?? 0}, 'ACTIVE', NOW(), NOW())
        RETURNING *`
      const created = row[0]
      if (!created) throw new TemplateAdminError('TEMPLATE_STYLE_CREATE_FAILED', 500, 'Template style could not be created')
      await this.audit(actor, created.id, 'template.style_created', requestId)
      return { style: dto(created) }
    } catch (error) { if (duplicate(error)) throw new TemplateAdminError('TEMPLATE_STYLE_KEY_CONFLICT', 409, 'Template style key already exists'); throw error }
  }

  async update(actor: PlatformAdminActor, id: string, data: UpdateTemplateStyle, requestId: string) {
    const existing = await this.find(id)
    if (!existing) throw new TemplateAdminError('TEMPLATE_STYLE_NOT_FOUND', 404, 'Template style not found')
    try {
      const row = await this.db.$queryRaw<StyleRow[]>`
        UPDATE "TemplateStyle" SET
          key = COALESCE(${data.key ?? null}, key), name = COALESCE(${data.name ?? null}, name),
          description = CASE WHEN ${data.description === undefined} THEN description ELSE ${data.description ?? null} END,
          "sortOrder" = COALESCE(${data.sortOrder ?? null}, "sortOrder"), status = COALESCE(${data.status ?? null}::"TemplateStyleStatus", status), "updatedAt" = NOW()
        WHERE id = ${id}::uuid RETURNING *`
      const updated = row[0]
      if (!updated) throw new TemplateAdminError('TEMPLATE_STYLE_NOT_FOUND', 404, 'Template style not found')
      await this.audit(actor, id, 'template.style_updated', requestId)
      return { style: dto(updated) }
    } catch (error) { if (duplicate(error)) throw new TemplateAdminError('TEMPLATE_STYLE_KEY_CONFLICT', 409, 'Template style key already exists'); throw error }
  }

  async archive(actor: PlatformAdminActor, id: string, requestId: string) {
    const row = await this.db.$queryRaw<StyleRow[]>`UPDATE "TemplateStyle" SET status = 'ARCHIVED', "updatedAt" = NOW() WHERE id = ${id}::uuid RETURNING *`
    if (!row[0]) throw new TemplateAdminError('TEMPLATE_STYLE_NOT_FOUND', 404, 'Template style not found')
    await this.audit(actor, id, 'template.style_archived', requestId)
    return { style: dto(row[0]) }
  }

  async stylesForTemplate(templateKey: string) {
    const rows = await this.db.$queryRaw<StyleRow[]>`
      SELECT s.* FROM "TemplateStyle" s JOIN "TemplateStyleAssignment" a ON a."styleId" = s.id
      JOIN "Template" t ON t.id = a."templateId" WHERE t.key = ${templateKey} ORDER BY s."sortOrder", s.name`
    return { items: rows.map(dto) }
  }

  async replace(actor: PlatformAdminActor, templateKey: string, styleIds: string[], requestId: string) {
    return this.db.$transaction(async (tx) => {
      const template = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM "Template" WHERE key = ${templateKey}`
      if (!template[0]) throw new TemplateAdminError('TEMPLATE_NOT_FOUND', 404, 'Template not found')
      const unique = [...new Set(styleIds)]
      if (unique.length) {
        const styles = await tx.$queryRaw<{ id: string; status: string }[]>`SELECT id, status FROM "TemplateStyle" WHERE id IN (${Prisma.join(unique.map((id) => Prisma.sql`${id}::uuid`))})`
        if (styles.length !== unique.length || styles.some((style) => style.status !== 'ACTIVE')) throw new TemplateAdminError('TEMPLATE_STYLE_INVALID', 400, 'All styles must exist and be active')
      }
      await tx.$executeRaw`DELETE FROM "TemplateStyleAssignment" WHERE "templateId" = ${template[0].id}::uuid`
      for (const styleId of unique) await tx.$executeRaw`INSERT INTO "TemplateStyleAssignment" ("templateId", "styleId") VALUES (${template[0].id}::uuid, ${styleId}::uuid)`
      await this.audit(actor, template[0].id, 'template.styles_replaced', requestId, tx)
      return this.stylesForTemplateTx(tx, templateKey)
    })
  }

  async add(actor: PlatformAdminActor, templateKey: string, styleId: string, requestId: string) { return this.mutateAssignment(actor, templateKey, styleId, requestId, 'add') }
  async remove(actor: PlatformAdminActor, templateKey: string, styleId: string, requestId: string) { return this.mutateAssignment(actor, templateKey, styleId, requestId, 'remove') }

  private async mutateAssignment(actor: PlatformAdminActor, templateKey: string, styleId: string, requestId: string, action: 'add' | 'remove') {
    return this.db.$transaction(async (tx) => {
      const template = await tx.$queryRaw<{ id: string }[]>`SELECT id FROM "Template" WHERE key = ${templateKey}`
      if (!template[0]) throw new TemplateAdminError('TEMPLATE_NOT_FOUND', 404, 'Template not found')
      if (action === 'add') {
        const style = await tx.$queryRaw<{ id: string; status: string }[]>`SELECT id, status FROM "TemplateStyle" WHERE id = ${styleId}::uuid`
        if (!style[0] || style[0].status !== 'ACTIVE') throw new TemplateAdminError('TEMPLATE_STYLE_INVALID', 400, 'Style must exist and be active')
        await tx.$executeRaw`INSERT INTO "TemplateStyleAssignment" ("templateId", "styleId") VALUES (${template[0].id}::uuid, ${styleId}::uuid) ON CONFLICT DO NOTHING`
      } else await tx.$executeRaw`DELETE FROM "TemplateStyleAssignment" WHERE "templateId" = ${template[0].id}::uuid AND "styleId" = ${styleId}::uuid`
      await this.audit(actor, template[0].id, `template.style_${action === 'add' ? 'assigned' : 'removed'}`, requestId, tx)
      return this.stylesForTemplateTx(tx, templateKey)
    })
  }

  private async find(id: string) { const rows = await this.db.$queryRaw<StyleRow[]>`SELECT * FROM "TemplateStyle" WHERE id = ${id}::uuid`; return rows[0] }
  private async stylesForTemplateTx(tx: Prisma.TransactionClient, templateKey: string) { const rows = await tx.$queryRaw<StyleRow[]>`SELECT s.* FROM "TemplateStyle" s JOIN "TemplateStyleAssignment" a ON a."styleId" = s.id JOIN "Template" t ON t.id = a."templateId" WHERE t.key = ${templateKey} ORDER BY s."sortOrder", s.name`; return { items: rows.map(dto) } }
  private async audit(actor: PlatformAdminActor, resourceId: string, action: string, requestId: string, db: Db = this.db) { await db.$executeRaw`INSERT INTO "AuditLog" (id, "actorUserId", action, "resourceType", "resourceId", "requestId", "occurredAt") VALUES (gen_random_uuid(), ${actor.userId}::uuid, ${action}, 'TemplateStyle', ${resourceId}, ${requestId}, NOW())` }
}


