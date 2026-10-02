import { CircleNotch } from '@phosphor-icons/react'

export function ModalSavingStatus({ label = 'Đang lưu thông tin…' }: { label?: string }) {
  return (
    <div className="modal-saving-status" role="status" aria-live="polite">
      <CircleNotch size={22} aria-hidden="true" />
      <span>{label}</span>
    </div>
  )
}
