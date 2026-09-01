import { Monitor } from '@phosphor-icons/react'

type Props = {
  open: boolean
  onClose: () => void
}

export function MobileEditorAdviceModal({ open, onClose }: Props) {
  if (!open) return null

  return <div className="editor-mobile-advice-backdrop" role="presentation">
    <section className="editor-mobile-advice" role="dialog" aria-modal="true" aria-labelledby="mobile-editor-advice-title">
      <Monitor size={30} />
      <h2 id="mobile-editor-advice-title">Chỉnh thiệp dễ hơn trên máy tính</h2>
      <p>Bạn vẫn có thể chỉnh sửa đầy đủ trên điện thoại. Với màn hình lớn, việc nhập nội dung và quan sát toàn bộ thiệp sẽ trực quan hơn.</p>
      <button className="button button-primary" type="button" onClick={onClose}>Đã hiểu, tiếp tục</button>
    </section>
  </div>
}
