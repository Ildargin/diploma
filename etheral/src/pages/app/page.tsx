import { BlockWidget, Blocks, FlexBox, SearchBox, Transactions } from '@components'

export const App = () => {
  return (
    <>
      <FlexBox direction="col">
        <SearchBox />
        <BlockWidget />
        <FlexBox justify="center" wrap="wrap">
          <FlexBox direction="col">
            <span style={{ margin: '10px 15px', fontSize: '18px' }}>Recent Blocks</span>
            <Blocks />
          </FlexBox>
          <FlexBox direction="col">
            <span style={{ margin: '10px 15px', fontSize: '18px' }}>Recent Transactions</span>
            <Transactions />
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </>
  )
}
