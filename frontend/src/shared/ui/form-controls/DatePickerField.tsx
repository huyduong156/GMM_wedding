import { CalendarBlank, CaretDown, Heart } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { DayButton, DayPicker, type DayButtonProps } from 'react-day-picker'
import 'react-day-picker/style.css'

type DatePickerFieldProps = {
  id?: string
  name?: string
  label?: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  'aria-label'?: string
}
const parseDate = (value: string) => {
  if (!value) return undefined
  const iso = value.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) return new Date(Number(iso[1]), Number(iso[2]) - 1, Number(iso[3]))
  const display = value.match(/^(\d{1,2})\D+(\d{1,2})\D+(\d{4})$/)
  return display
    ? new Date(Number(display[3]), Number(display[2]) - 1, Number(display[1]))
    : undefined
}
const formatDate = (value: Date) =>
  `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
const displayDate = (value: string) => {
  const date = parseDate(value)
  return date
    ? new Intl.DateTimeFormat('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(date)
    : ''
}
function HeartDayButton({ day, modifiers, ...props }: DayButtonProps) {
  const selected = Boolean(modifiers.selected)
  return (
    <DayButton day={day} modifiers={modifiers} {...props}>
      {selected ? <Heart className="date-picker-heart" weight="fill" aria-hidden="true" /> : null}
      <span className={selected ? 'date-picker-day-number' : undefined}>{day.date.getDate()}</span>
    </DayButton>
  )
}

export function DatePickerField({
  id,
  label,
  value,
  onChange,
  placeholder = 'Chọn ngày',
  disabled,
  className = '',
  'aria-label': ariaLabel,
}: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 })
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (
        !rootRef.current?.contains(event.target as Node) &&
        !popoverRef.current?.contains(event.target as Node)
      )
        setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  useEffect(() => {
    if (!open) return
    const updatePosition = () => {
      const trigger = triggerRef.current
      if (!trigger) return
      const rect = trigger.getBoundingClientRect()
      const width = 330
      const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
      const height = 390
      const top =
        rect.bottom + 8 + height > window.innerHeight
          ? Math.max(8, rect.top - height - 8)
          : rect.bottom + 8
      setPopoverPosition({ top, left })
    }
    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)
    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [open])
  const selected = parseDate(value)
  const popover = open ? (
    <div
      ref={popoverRef}
      className="date-picker-popover"
      role="dialog"
      aria-label={label}
      style={{
        position: 'fixed',
        top: popoverPosition.top,
        left: popoverPosition.left,
        zIndex: 1000,
      }}
    >
      <DayPicker
        components={{ DayButton: HeartDayButton }}
        mode="single"
        selected={selected}
        defaultMonth={selected}
        onSelect={(next) => {
          if (next) {
            onChange(formatDate(next))
            setOpen(false)
          }
        }}
        captionLayout="label"
      />
    </div>
  ) : null
  return (
    <div className={`date-picker-field ${className}`} ref={rootRef}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <button
        ref={triggerRef}
        id={id}
        aria-label={ariaLabel || label}
        type="button"
        className="date-picker-trigger"
        aria-haspopup="dialog"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
      >
        <CalendarBlank size={17} />
        <span className={value ? '' : 'is-placeholder'}>{displayDate(value) || placeholder}</span>
        <CaretDown className="date-picker-caret" size={16} />
      </button>
      {typeof document !== 'undefined' && popover ? createPortal(popover, document.body) : null}
    </div>
  )
}
