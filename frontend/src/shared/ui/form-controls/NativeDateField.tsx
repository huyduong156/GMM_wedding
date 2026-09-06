import { DatePickerField } from './DatePickerField'

type NativeDateFieldProps = {
  id?: string
  name?: string
  value: string
  onChange?: (event: { target: { value: string } }) => void
  disabled?: boolean
  className?: string
  'aria-label'?: string
}
export function NativeDateField({
  id,
  value,
  onChange,
  disabled,
  className,
  'aria-label': ariaLabel,
}: NativeDateFieldProps) {
  return (
    <DatePickerField
      id={id}
      value={value}
      onChange={(next) => onChange?.({ target: { value: next } })}
      disabled={disabled}
      className={className}
      aria-label={ariaLabel}
    />
  )
}
