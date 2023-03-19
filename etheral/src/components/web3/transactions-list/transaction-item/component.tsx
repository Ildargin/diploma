import { Link } from 'react-router-dom'
import { FlexBox } from '@components'
import { useGetTransaction } from '@hooks'
import { fromWei, trimTransaction } from '@utils'
import './component.scss'

type Props = React.HTMLAttributes<HTMLDivElement> & {
  tx: string
}

export const TransactionItem = ({ tx, ...rest }: Props) => {
  const { data } = useGetTransaction(tx)

  return (
    <div className="block-item" {...rest}>
      <FlexBox direction="col" align="flex-start">
        <Link to={`/tx/${tx}`} className="block-heading">
          {trimTransaction(tx)}
        </Link>
        <span className="block-normal">{data?.blockNumber}</span>
      </FlexBox>
      <FlexBox direction="col" align="flex-end">
        <span className="block-heading">
          {data?.value && fromWei(data.value, 'ether', 2)}
          <span className="block-normal"> ETH</span>
        </span>
        <span className="block-normal">
          {data?.gasPrice && fromWei(data.gasPrice, 'gwei', 4)} Gwei
        </span>
      </FlexBox>
    </div>
  )
}
