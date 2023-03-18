import { Link } from 'react-router-dom'
import { FlexBox, SourceSelector } from '@components'
import { AddressBox } from './address-box'
import './component.scss'

export const Navigation = () => {
  return (
    <nav className="navigation">
      <Link to="/">Etheral</Link>
      <FlexBox style={{ gap: 15, marginLeft: 10 }}>
        <SourceSelector />
        <AddressBox className="connect-btn" />
      </FlexBox>
    </nav>
  )
}
