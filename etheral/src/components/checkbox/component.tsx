import { useState } from 'react'
import { Container } from '@components'
import './component.scss'

type Props = {
  checked?: boolean
  onChange?: (status: boolean) => void
}

export const Checkbox = ({ checked = false, onChange, ...props }: Props) => {
  const [innerChecked, setInnerChecked] = useState(checked)

  const onCheckboxClick = () => {
    if (onChange) {
      setInnerChecked((s) => {
        onChange(!s)
        return !s
      })
    }
  }
  return (
    <Container className="checkbox-container" onClick={onCheckboxClick} {...props}>
      {(checked || innerChecked) && <div className="checkbox-container-checked" />}
    </Container>
  )
}
