import { FlexBox, Skeleton } from '@components'
import { useGetRecentBlocks } from '@hooks'
import { BlockItem } from './block-item'

export const Blocks = () => {
  const { data, isLoading } = useGetRecentBlocks(5)

  return isLoading ? (
    <Skeleton
      count={5}
      width={250}
      height={34.5}
      style={{ margin: 5, padding: 10, border: '1px solid transparent' }}
    />
  ) : (
    <FlexBox direction="col">
      {data?.map((block) => (
        <BlockItem key={block.number} block={block} />
      ))}
    </FlexBox>
  )
}
