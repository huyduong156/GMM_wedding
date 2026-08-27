import { CalendarBlank, CaretDown, Heart } from '@phosphor-icons/react'
import { useEffect, useRef, useState } from 'react'
import { DayButton, DayPicker, type DayButtonProps } from 'react-day-picker'
import 'react-day-picker/style.css'

type DatePickerFieldProps = { id?: string; name?: string; label?: string; value: string; onChange: (value: string) => void; placeholder?: string; disabled?: boolean; className?: string; 'aria-label'?: string }
const parseDate = (value: string) => { if (!value) return undefined; const [year, month, day] = value.split('-').map(Number); return new Date(year, month - 1, day) }
const formatDate = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`
const displayDate = (value: string) => value ? new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(parseDate(value)) : ''
function HeartDayButton({ day, modifiers, ...props }: DayButtonProps) {
  const selected = Boolean(modifiers.selected)
  return <DayButton day={day} modifiers={modifiers} {...props}>{selected ? <Heart className="date-picker-heart" weight="fill" aria-hidden="true" /> : null}<span className={selected ? 'date-picker-day-number' : undefined}>{day.date.getDate()}</span></DayButton>
}

export function DatePickerField({ id, label, value, onChange, placeholder = 'Chọn ngày', disabled, className = '', 'aria-label': ariaLabel }: DatePickerFieldProps) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => { if (!open) return; const close = (event: MouseEvent) => { if (!rootRef.current?.contains(event.target as Node)) setOpen(false) }; document.addEventListener('mousedown', close); return () => document.removeEventListener('mousedown', close) }, [open])
  const selected = parseDate(value)
  return <div className={`date-picker-field ${className}`} ref={rootRef}>{label ? <label htmlFor={id}>{label}</label> : null}<button id={id} aria-label={ariaLabel || label} type="button" className="date-picker-trigger" aria-haspopup="dialog" aria-expanded={open} disabled={disabled} onClick={() => setOpen((current) => !current)}><CalendarBlank size={17} /><span className={value ? '' : 'is-placeholder'}>{displayDate(value) || placeholder}</span><CaretDown className="date-picker-caret" size={16} /></button>{open ? <div className="date-picker-popover" role="dialog" aria-label={label}><DayPicker components={{ DayButton: HeartDayButton }} mode="single" selected={selected} defaultMonth={selected} onSelect={(next) => { if (next) { onChange(formatDate(next)); setOpen(false) } }} captionLayout="label" /></div> : null}</div>
}