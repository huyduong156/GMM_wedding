export interface GuestView {
  id: string
  weddingId: string
  categoryId: string | null
  groupId: string | null
  name: string
  slug: string
  displayName: string | null
  phone: string | null
  email: string | null
  note: string | null
  tableName: string | null
  maxPartySize: number
  tags: string[]
  createdAt: Date
  updatedAt: Date
}
export interface GuestCategoryView {
  id: string
  weddingId: string
  parentId: string | null
  name: string
  depth: number
  sortOrder: number
  createdAt: Date
  updatedAt: Date
}
export interface GuestGroupView {
  id: string
  weddingId: string
  name: string
  note: string | null
  createdAt: Date
  updatedAt: Date
}
export interface PublicGuestLinkView {
  weddingSlug: string
  guestSlug: string
  guestName: string | null
  maxPartySize: number
  expiresAt: Date | null
}
export interface CreateGuestData {
  name: string
  displayName?: string | null | undefined
  categoryId?: string | null | undefined
  groupId?: string | null | undefined
  phone?: string | null | undefined
  email?: string | null | undefined
  note?: string | null | undefined
  tableName?: string | null | undefined
  maxPartySize: number
  tags: string[]
}
type Optional<T> = { [K in keyof T]?: T[K] | undefined }
export type UpdateGuestData = Optional<CreateGuestData>
export interface CreateCategoryData {
  name: string
  parentId?: string | null | undefined
  sortOrder: number
}
export interface UpdateCategoryData {
  name?: string | undefined
  parentId?: string | null | undefined
  sortOrder?: number | undefined
}
export interface CreateGroupData {
  name: string
  note?: string | undefined
}
export interface UpdateGroupData {
  name?: string | undefined
  note?: string | null | undefined
}
export interface GuestImportRow {
  name: string
  displayName?: string | null | undefined
  categoryPath?: string | undefined
  groupName?: string | undefined
  phone?: string | null | undefined
  email?: string | null | undefined
  note?: string | null | undefined
  tableName?: string | null | undefined
  maxPartySize?: number | undefined
  tags?: string[] | undefined
}
export interface GuestImportIssue {
  row: number
  field?: string
  message: string
}
export interface GuestExportRow extends GuestView {
  categoryPath: string
  groupName: string | null
}
export interface GuestRepository {
  resolvePublicGuestLink(weddingSlug: string, guestSlug: string): Promise<PublicGuestLinkView | null>
  listOwned(
    userId: string,
    weddingId: string,
    filter: {
      query?: string | undefined
      categoryId?: string | null | undefined
      groupId?: string | null | undefined
      limit: number
      cursor?: string | undefined
    },
  ): Promise<{ items: GuestView[]; nextCursor: string | null } | null>
  findOwned(userId: string, weddingId: string, guestId: string): Promise<GuestView | null>
  createOwned(userId: string, weddingId: string, data: CreateGuestData): Promise<GuestView | null>
  updateOwned(
    userId: string,
    weddingId: string,
    guestId: string,
    data: UpdateGuestData,
  ): Promise<GuestView | null>
  deleteOwned(userId: string, weddingId: string, guestId: string): Promise<boolean | null>
  bulkDeleteOwned(
    userId: string,
    weddingId: string,
    guestIds: string[],
  ): Promise<{ deletedCount: number } | null>
  bulkAssignCategory(
    userId: string,
    weddingId: string,
    guestIds: string[],
    categoryId: string | null,
  ): Promise<{ updatedCount: number } | null>
  listCategories(userId: string, weddingId: string): Promise<GuestCategoryView[] | null>
  createCategory(
    userId: string,
    weddingId: string,
    data: CreateCategoryData,
  ): Promise<GuestCategoryView | null>
  updateCategory(
    userId: string,
    weddingId: string,
    categoryId: string,
    data: UpdateCategoryData,
  ): Promise<GuestCategoryView | 'conflict' | null>
  deleteCategory(userId: string, weddingId: string, categoryId: string): Promise<boolean | null>
  bulkDeleteCategories(
    userId: string,
    weddingId: string,
    categoryIds: string[],
  ): Promise<{ deletedCount: number } | null>
  listGroups(userId: string, weddingId: string): Promise<GuestGroupView[] | null>
  createGroup(
    userId: string,
    weddingId: string,
    data: CreateGroupData,
  ): Promise<GuestGroupView | null>
  updateGroup(
    userId: string,
    weddingId: string,
    groupId: string,
    data: UpdateGroupData,
  ): Promise<GuestGroupView | null>
  deleteGroup(userId: string, weddingId: string, groupId: string): Promise<boolean | null>
  exportOwned(userId: string, weddingId: string): Promise<GuestExportRow[] | null>
  importOwned(
    userId: string,
    weddingId: string,
    rows: GuestImportRow[],
  ): Promise<GuestView[] | null>
}
