import { useQuery } from 'react-query'
import { useWeb3 } from '@contexts'

export const useGetTransaction = (hash: string) => {
  const { web3 } = useWeb3()
  const apiName = web3.active
  return useQuery([apiName, `transaction:${hash}`], async () => {
    const api = web3[apiName]?.eth
    if (!api) {
      return
    }
    const transaction = await api.getTransaction(hash)
    return transaction
  })
}
