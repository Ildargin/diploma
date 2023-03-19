import { FlexBox, Skeleton } from '@components'
import { useGetRecentTransactionsHashes } from '@hooks'
import { TransactionItem } from './transaction-item'

export const Transactions = () => {
  const { data, isLoading } = useGetRecentTransactionsHashes(5)

  return isLoading ? (
    <Skeleton
      count={5}
      width={250}
      height={34.5}
      style={{ margin: 5, padding: 10, border: '1px solid transparent' }}
    />
  ) : (
    <FlexBox direction="col">
      {data?.map((hash) => (
        <TransactionItem key={hash} tx={hash} />
      ))}
    </FlexBox>
  )
}
