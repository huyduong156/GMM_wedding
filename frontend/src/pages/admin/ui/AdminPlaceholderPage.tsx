import { Wrench } from '@phosphor-icons/react'

export function AdminPlaceholderPage({ title }: { title: string }) {
  return <section className="admin-placeholder"><Wrench size={28} /><p>Platform Admin</p><h1>{title}</h1><span>Khu vực này đã được tách riêng và sẽ được hoàn thiện theo quyền quản trị hệ thống.</span></section>
}
