import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetTransaction } from '@hooks'
import { fromWei, trimAddress } from '@utils'
import './component.scss'

export const TxTooltip = ({ hash }: { hash: string }) => {
  const [isHovering, setHovering] = useState(false)
  const { data } = useGetTransaction(hash)
  const navigate = useNavigate()
  const value = data?.value ? Number(fromWei(data.value, 'ether')) : 0

  return (
    <li className="txbit-container">
      <div
        className="txbit-block"
        onClick={() => navigate(`/tx/${hash}`)}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        style={{ opacity: value + 0.05 }}
      />
      {!isHovering ? null : (
        <div className="txbit-tooltip">
          <div className="txbit-tooltip-top">
            <div>
              <span className="txbit-tooltip-field">From</span>
              <div className="txbit-tooltip-value">{data?.from && trimAddress(data.from)}</div>
            </div>
            <div>
              <span className="txbit-tooltip-field">To</span>
              <div className="txbit-tooltip-value">{data?.to && trimAddress(data.to)}</div>
            </div>
          </div>
          <div className="txbit-tooltip-bottom">
            <div>
              <span className="txbit-tooltip-field">Value</span>
              <div className="txbit-tooltip-value">
                <div>{value} ETH</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  )
}
