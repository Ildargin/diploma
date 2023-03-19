import { fromWei as fw } from 'web3-utils'
import { Unit } from 'web3-utils/types'

export const fromWei = (value: string, unit?: Unit, rounding?: number) => {
  const valTuple = fw(value, unit).split('.')
  if (rounding && valTuple.length == 2) {
    valTuple[1] = valTuple[1].slice(0, rounding + 1)
  }
  return valTuple.join('.')
}
