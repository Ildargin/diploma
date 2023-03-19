import { createContext, useContext, useState } from 'react'
import Web3 from 'web3'

type ProviderNames = 'infura' | 'rpc' | 'alchemy'

type web3State = {
  infura: null | Web3
  rpc: null | Web3
  alchemy: null | Web3
}

type Context = {
  web3: web3State
  addProvider: (name: ProviderNames, param: string) => void
}

const Web3Context = createContext<Context>(undefined as unknown as Context)
export const useWeb3 = () => useContext<Context>(Web3Context)

export const Web3Provider = ({ children }: { children: React.ReactNode }) => {
  const [web3, setWeb3] = useState<web3State>({ infura: null, rpc: null, alchemy: null })

  const addProvider = (name: ProviderNames, param: string) => {
    setWeb3((s) => ({ ...s, [name]: new Web3(param) }))
  }
  return <Web3Context.Provider value={{ web3, addProvider }}>{children}</Web3Context.Provider>
}
