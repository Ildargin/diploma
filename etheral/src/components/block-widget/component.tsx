import { useNavigate } from 'react-router-dom'
import { Skeleton } from '@components'
import { useGetRecentBlocks } from '@hooks'
import './component.scss'
import { TxTooltip } from './tx-tooltip'

const MaxBits = 22 * 10

export const BlockWidget = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useGetRecentBlocks(5)
  const lastBlock = data?.at(0)
  const undisplayed = Number(lastBlock?.transactions.length) - MaxBits

  return isLoading ? (
    <Skeleton width={582} height={372} style={{ margin: 24 }} />
  ) : (
    <section className="block-widget">
      <div className="block-container">
        <div className="block-container-header">
          <div className="block-container-header-top">
            <span>Last block: №{lastBlock?.number.toLocaleString()}</span>
            <span>Transaction count: {lastBlock?.transactions.length}</span>
          </div>
        </div>
        <div className="block-container-body">
          {lastBlock?.transactions.slice(0, MaxBits).map((hash) => (
            <TxTooltip key={hash} hash={hash} />
          ))}
        </div>
        <div className="block-container-footer">
          <span>{undisplayed > 0 ? `MORE TX ${undisplayed}` : ''} </span>
          <div>
            <button
              style={{ padding: '5px', margin: 0 }}
              onClick={() => navigate(`/block/${lastBlock?.number}`)}
            >
              more details
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
