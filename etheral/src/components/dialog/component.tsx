import { ReactNode } from 'react'
import './component.scss'

type Props = {
  open?: boolean
  children: ReactNode
}

export const Dialog = ({ open, children }: Props) => {
  return <>{open && <div className="dialog-overlay">{children}</div>}</>
}
