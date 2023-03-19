import { useQuery } from 'react-query'
import { useWeb3 } from '@contexts'

export const useGetRecentTransactionsHashes = (count: number) => {
  const { web3 } = useWeb3()
  const apiName = web3.active
  return useQuery([apiName, 'transactionsHashes'], async () => {
    const api = web3[apiName]?.eth
    if (!api) {
      return
    }
    const txHashes = []
    const lastBlock = await api.getBlockNumber()
    for (let i = 0; i < count; i++) {
      if (txHashes.length > count) {
        break
      }
      const hashes = (await api.getBlock(lastBlock - i)).transactions
      txHashes.push(...hashes)
    }

    return txHashes.slice(0, count)
  })
}
