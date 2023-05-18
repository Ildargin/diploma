export type Tx = {
  id: number
  time: number
  txfrom: string
  txto: string
  gas: string
  gasPrice: string
  block: number
  txhash: string
  value: string
  contract_to: string
  status: boolean
  contract_value: string
}

export type SearchParams = {
  address1: string
  address2: string
  maxDepth: number
  nodeTrashnold: number
}
