import * as SelectPrimitive from '@radix-ui/react-select'
import { CaretDown, Check } from '@phosphor-icons/react'
import { Children, isValidElement, type ReactNode } from 'react'

const EMPTY = '__empty__'
type SelectChildProps = { value?: string; disabled?: boolean; children?: ReactNode }
type NativeSelectFieldProps = { name?: string; id?: string; value?: string; defaultValue?: string; onChange?: (event: { target: { value: string } }) => void; children: ReactNode; disabled?: boolean; required?: boolean; className?: string; 'aria-label'?: string }

export function NativeSelectField({ name: _name, id, value, defaultValue, onChange, children, disabled, required, className = '', 'aria-label': ariaLabel }: NativeSelectFieldProps) {
  const options = Children.toArray(children).flatMap((child) => {
    if (!isValidElement(child)) return []
    const props = child.props as SelectChildProps & { label?: string }
    if (props.label !== undefined) {
      return Children.toArray(props.children).filter(isValidElement).map((option) => {
        const optionProps = option.props as SelectChildProps
        return { value: optionProps.value ?? String(optionProps.children ?? ''), label: optionProps.children, disabled: optionProps.disabled }
      })
    }
    return [{ value: props.value ?? String(props.children ?? ''), label: props.children, disabled: props.disabled }]
  })
  const currentValue = value ?? defaultValue ?? ''
  const selectValue = currentValue || EMPTY
  return <div className={`native-select-field ${className}`}><SelectPrimitive.Root name={_name} value={value !== undefined ? selectValue : undefined} defaultValue={value === undefined ? selectValue : undefined} onValueChange={(next) => onChange?.({ target: { value: next === EMPTY ? '' : next } })} disabled={disabled} required={required}><SelectPrimitive.Trigger id={id} className="select-field-trigger" aria-label={ariaLabel}><SelectPrimitive.Value /><SelectPrimitive.Icon><CaretDown size={14} /></SelectPrimitive.Icon></SelectPrimitive.Trigger><SelectPrimitive.Portal><SelectPrimitive.Content className="select-field-content" position="popper" sideOffset={6}><SelectPrimitive.Viewport>{options.map((option) => <SelectPrimitive.Item className="select-field-item" key={option.value || EMPTY} value={option.value || EMPTY} disabled={option.disabled}><SelectPrimitive.ItemText>{option.label}</SelectPrimitive.ItemText><SelectPrimitive.ItemIndicator><Check size={15} /></SelectPrimitive.ItemIndicator></SelectPrimitive.Item>)}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal></SelectPrimitive.Root></div>
}
