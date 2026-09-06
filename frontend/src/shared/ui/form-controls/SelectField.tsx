import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, CaretDown, CaretUp } from '@phosphor-icons/react'

type SelectOption = { value: string; label: string; disabled?: boolean }
type SelectFieldProps = {
  id?: string
  label?: string
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
}
const EMPTY = '__empty__'

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = 'Chọn một giá trị',
  disabled,
  className = '',
  required,
}: SelectFieldProps) {
  const selectedValue = value || EMPTY
  return (
    <div className={`select-field ${className}`}>
      {label ? <label htmlFor={id}>{label}</label> : null}
      <SelectPrimitive.Root
        value={selectedValue}
        onValueChange={(next) => onChange(next === EMPTY ? '' : next)}
        disabled={disabled}
        required={required}
      >
        <SelectPrimitive.Trigger id={id} className="select-field-trigger" aria-label={label}>
          <SelectPrimitive.Value placeholder={placeholder} />
          <SelectPrimitive.Icon>
            <CaretDown size={16} />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Portal>
          <SelectPrimitive.Content
            className="select-field-content"
            position="popper"
            sideOffset={6}
          >
            <SelectPrimitive.ScrollUpButton className="select-field-scroll">
              <CaretUp size={14} />
            </SelectPrimitive.ScrollUpButton>
            <SelectPrimitive.Viewport>
              <SelectPrimitive.Item className="select-field-item" value={EMPTY}>
                <SelectPrimitive.ItemText>{placeholder}</SelectPrimitive.ItemText>
                <SelectPrimitive.ItemIndicator>
                  <Check size={15} />
                </SelectPrimitive.ItemIndicator>
              </SelectPrimitive.Item>
              {options
                .filter((option) => option.value !== '')
                .map((option) => (
                  <SelectPrimitive.Item
                    className="select-field-item"
                    key={option.value}
                    value={option.value}
                    disabled={option.disabled}
                  >
                    <SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText>
                    <SelectPrimitive.ItemIndicator>
                      <Check size={15} />
                    </SelectPrimitive.ItemIndicator>
                  </SelectPrimitive.Item>
                ))}
            </SelectPrimitive.Viewport>
            <SelectPrimitive.ScrollDownButton className="select-field-scroll">
              <CaretDown size={14} />
            </SelectPrimitive.ScrollDownButton>
          </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
      </SelectPrimitive.Root>
    </div>
  )
}

export type { SelectOption }
