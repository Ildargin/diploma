import type Web3 from 'web3'

export type ProviderNames = 'infura' | 'rpc' | 'alchemy'

export type Web3State = {
  active: ProviderNames
  infura: null | Web3
  rpc: null | Web3
  alchemy: null | Web3
}

export type Web3ContextType = {
  web3: Web3State
  addProvider: (name: ProviderNames, param: string) => void
}
