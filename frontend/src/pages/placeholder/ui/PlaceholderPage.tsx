import { ArrowRight } from '@phosphor-icons/react'
import { content } from '../model/placeholder-content'

export function PlaceholderPage({ section }: { section: keyof typeof content }) {
  const item = content[section]
  const Icon = item.icon
  return (
    <div className="placeholder-page">
      <div className="placeholder-icon"><Icon size={26} /></div>
      <p className="breadcrumb">Mai & Đức <span>/</span> {item.title}</p>
      <h1>{item.title}</h1>
      <p>{item.description}</p>
      <button className="button button-primary">{item.action} <ArrowRight size={17} /></button>
      <div className="placeholder-note"><strong>Đang chuẩn bị</strong><span>Module này đã có route và sẽ được triển khai ở milestone kế tiếp.</span></div>
    </div>
  )
}
