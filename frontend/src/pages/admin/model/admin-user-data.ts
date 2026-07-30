export type AdminUserStatus = 'active' | 'suspended' | 'pending'
export type AdminUserRole = 'owner' | 'collaborator' | 'admin'

export type AdminUser = {
  id: string
  name: string
  email: string
  initials: string
  role: AdminUserRole
  status: AdminUserStatus
  weddings: number
  joinedAt: string
  lastActive: string
}

export const adminUsers: AdminUser[] = [
  { id: 'usr_01', name: 'Nguyễn Minh Anh', email: 'minhanh@example.vn', initials: 'MA', role: 'owner', status: 'active', weddings: 2, joinedAt: '18/07/2026', lastActive: '5 phút trước' },
  { id: 'usr_02', name: 'Trần Hoàng Nam', email: 'hoangnam@example.vn', initials: 'HN', role: 'owner', status: 'active', weddings: 1, joinedAt: '16/07/2026', lastActive: '28 phút trước' },
  { id: 'usr_03', name: 'Lê Thảo Vy', email: 'thaovy@example.vn', initials: 'TV', role: 'collaborator', status: 'pending', weddings: 1, joinedAt: '15/07/2026', lastActive: 'Chưa đăng nhập' },
  { id: 'usr_04', name: 'Phạm Gia Huy', email: 'giahuy@example.vn', initials: 'GH', role: 'owner', status: 'suspended', weddings: 3, joinedAt: '09/07/2026', lastActive: '6 ngày trước' },
  { id: 'usr_05', name: 'Đỗ Ngọc Linh', email: 'ngoclinh@example.vn', initials: 'NL', role: 'owner', status: 'active', weddings: 1, joinedAt: '04/07/2026', lastActive: '2 giờ trước' },
  { id: 'usr_06', name: 'Vũ Quỳnh Trang', email: 'quynhtrang@example.vn', initials: 'QT', role: 'admin', status: 'active', weddings: 0, joinedAt: '28/06/2026', lastActive: '12 phút trước' },
]

export const adminUserRoleLabels: Record<AdminUserRole, string> = {
  owner: 'Chủ wedding',
  collaborator: 'Cộng tác viên',
  admin: 'Quản trị viên',
}

export const adminUserStatusLabels: Record<AdminUserStatus, string> = {
  active: 'Hoạt động',
  suspended: 'Tạm khóa',
  pending: 'Chờ xác minh',
}
