import { useQuery } from 'react-query'
import { BlockTransactionString } from 'web3-eth'
import { useWeb3 } from '@contexts'

export const useGetRecentBlocks = (count: number) => {
  const { web3 } = useWeb3()
  const apiName = web3.active
  return useQuery([apiName, 'blocks'], async () => {
    const api = web3[apiName]?.eth
    if (!api) {
      return
    }
    const lastBlock = await api.getBlockNumber()
    const blocks: BlockTransactionString[] = []
    for (let i = 0; i < count; i++) {
      const block = await api.getBlock(lastBlock - i)
      blocks.push(block)
    }
    return blocks
  })
}
