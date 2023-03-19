import moment from 'moment'
import { Link } from 'react-router-dom'
import { BlockTransactionString } from 'web3-eth'
import { FlexBox } from '@components'
import './component.scss'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  block: BlockTransactionString
}

moment.relativeTimeThreshold('ss', 0)

export const BlockItem = ({ block, ...rest }: Props) => (
  <div className="block-item" {...rest}>
    <FlexBox direction="col" align="flex-start">
      <Link to={`/block/${block.number}`} className="block-heading">
        {block.number.toLocaleString()}
      </Link>
      <span className="block-normal">{moment(Number(block.timestamp) * 1000).fromNow()}</span>
    </FlexBox>
    <FlexBox direction="col" align="flex-end">
      <span className="block-heading">
        {block.transactions.length} <span className="block-normal">transactions</span>
      </span>
    </FlexBox>
  </div>
)
