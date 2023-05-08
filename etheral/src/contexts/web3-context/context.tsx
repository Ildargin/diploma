import { createContext, useContext, useState } from 'react'
import Web3 from 'web3'
import type { ProviderNames, Web3ContextType, Web3State } from './context.types'

const Web3Context = createContext<Web3ContextType>(undefined as unknown as Web3ContextType)
export const useWeb3 = () => useContext<Web3ContextType>(Web3Context)

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<Web3State>({
    active: 'infura',
    infura: new Web3('https://sepolia.infura.io/v3/0d6970b0645847c9b3a651c4322a5ff1'),
    rpc: null,
    alchemy: null,
  })

  const addProvider = (name: ProviderNames, param: string) => {
    setWeb3((s) => ({ ...s, active: name, [name]: new Web3(param) }))
  }
  return <Web3Context.Provider value={{ web3, addProvider }}>{children}</Web3Context.Provider>
}
