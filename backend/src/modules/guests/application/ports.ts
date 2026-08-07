export interface GuestView { id: string; weddingId: string; categoryId: string | null; groupId: string | null; displayName: string; phone: string | null; email: string | null; note: string | null; tableName: string | null; maxPartySize: number; tags: string[]; createdAt: Date; updatedAt: Date }
export interface GuestCategoryView { id: string; weddingId: string; parentId: string | null; name: string; depth: number; sortOrder: number; createdAt: Date; updatedAt: Date }
export interface GuestGroupView { id: string; weddingId: string; name: string; note: string | null; createdAt: Date; updatedAt: Date }
export interface InvitationView { id: string; weddingId: string; guestId: string | null; label: string | null; publicSlug: string | null; status: string; maxPartySize: number; expiresAt: Date | null; revokedAt: Date | null; lastViewedAt: Date | null; createdAt: Date; updatedAt: Date }
export interface PublicInvitationView { weddingSlug: string; invitationSlug: string; guestName: string | null; maxPartySize: number; expiresAt: Date | null }
export interface CreateGuestData { displayName: string; categoryId?: string | undefined; groupId?: string | undefined; phone?: string | undefined; email?: string | undefined; note?: string | undefined; tableName?: string | undefined; maxPartySize: number; tags: string[] }
type Optional<T> = { [K in keyof T]?: T[K] | undefined }
export type UpdateGuestData = Optional<CreateGuestData>
export interface CreateCategoryData { name: string; parentId?: string | undefined; sortOrder: number }
export interface UpdateCategoryData { name?: string | undefined; parentId?: string | null | undefined; sortOrder?: number | undefined }
export interface CreateGroupData { name: string; note?: string | undefined }
export interface GuestImportRow { displayName: string; categoryPath?: string | undefined; groupName?: string | undefined; phone?: string | undefined; email?: string | undefined; note?: string | undefined; tableName?: string | undefined; maxPartySize?: number | undefined; tags?: string[] | undefined }
export interface GuestImportIssue { row: number; field?: string; message: string }
export interface GuestExportRow extends GuestView { categoryPath: string; groupName: string | null }
export interface CreateInvitationData { guestId?: string | undefined; label?: string | undefined; maxPartySize: number; expiresAt?: Date | undefined }
export interface GuestRepository {
  listOwned(userId: string, weddingId: string, filter: { query?: string | undefined; categoryId?: string | undefined; groupId?: string | undefined; limit: number; cursor?: string | undefined }): Promise<{ items: GuestView[]; nextCursor: string | null } | null>
  findOwned(userId: string, weddingId: string, guestId: string): Promise<GuestView | null>
  createOwned(userId: string, weddingId: string, data: CreateGuestData): Promise<GuestView | null>
  updateOwned(userId: string, weddingId: string, guestId: string, data: UpdateGuestData): Promise<GuestView | null>
  deleteOwned(userId: string, weddingId: string, guestId: string): Promise<boolean | null>
  listCategories(userId: string, weddingId: string): Promise<GuestCategoryView[] | null>
  createCategory(userId: string, weddingId: string, data: CreateCategoryData): Promise<GuestCategoryView | null>
  updateCategory(userId: string, weddingId: string, categoryId: string, data: UpdateCategoryData): Promise<GuestCategoryView | 'conflict' | null>
  deleteCategory(userId: string, weddingId: string, categoryId: string): Promise<boolean | null>
  listGroups(userId: string, weddingId: string): Promise<GuestGroupView[] | null>
  createGroup(userId: string, weddingId: string, data: CreateGroupData): Promise<GuestGroupView | null>
  deleteGroup(userId: string, weddingId: string, groupId: string): Promise<boolean | null>
  createInvitation(userId: string, weddingId: string, data: CreateInvitationData): Promise<{ invitation: InvitationView; token: string } | null>
  rotateInvitation(userId: string, weddingId: string, invitationId: string): Promise<{ invitation: InvitationView; token: string } | null>
  revokeInvitation(userId: string, weddingId: string, invitationId: string): Promise<boolean | null>
  resolvePublicInvitation(weddingSlug: string, guestSlug: string): Promise<PublicInvitationView | null>
  exportOwned(userId: string, weddingId: string): Promise<GuestExportRow[] | null>
  importOwned(userId: string, weddingId: string, rows: GuestImportRow[]): Promise<GuestView[] | null>
}
