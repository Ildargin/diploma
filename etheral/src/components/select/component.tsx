import { useState } from 'react'
import './component.scss'

type Props = {
  options: string[]
  value: string
  onChange: (option: string) => void
}

export const Select = ({ options, value, onChange }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option: string) => {
    setIsOpen(false)
    onChange(option)
  }

  return (
    <div className={`custom-select ${isOpen ? 'open' : ''}`}>
      <div className="selected-option" onClick={() => setIsOpen(!isOpen)}>
        <span>{value}</span>
        <div className="select-icon">
          <svg viewBox="0 0 30 5">
            {isOpen ? (
              <path d="M5 5.5L9.5 1H0.5L5 5.5Z" fill="#ffff" />
            ) : (
              <path d="M5 0.5L0.5 5H9.5L5 0.5Z" fill="#ffff" />
            )}
          </svg>
        </div>
      </div>
      {isOpen && (
        <ul className="options">
          {options.map((option) => (
            <li key={option} onClick={() => handleSelect(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Select
