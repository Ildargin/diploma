import { useEffect, useState } from 'react'
import { Button, FlexBox, Select } from '@components'
import { useWeb3 } from '@contexts'
import { AlchemyDialog } from './alchemy-dialog'
import './component.scss'
import { InfuraDialog } from './infura-dialog'
import { RpcDialog } from './rpc-dialog'
import { SettingsIcon } from './settings-icon'

const options = ['Infura', 'JsonRPC server', 'Alchemy']

export const SourceSelector = () => {
  const [rpcDialogOpen, setRpcDialogOpen] = useState(false)
  const [infuraDialogOpen, setInfuraDialogOpen] = useState(false)
  const [alchemyDialogOpen, setAlchemyDialogOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const { addProvider } = useWeb3()
  const isCustom = selectedOption === 'JsonRPC server'
  const isInfura = selectedOption === 'Infura'
  const isAlchemy = selectedOption === 'Alchemy'

  const onSelectedChange = (value: string) => {
    const option = options.find((item) => item === value)
    if (option) {
      setSelectedOption(option)
    }
  }

  const openDialog = () => {
    if (isInfura) {
      setInfuraDialogOpen(true)
    }
    if (isCustom) {
      setRpcDialogOpen(true)
    }
    if (isAlchemy) {
      setAlchemyDialogOpen(true)
    }
  }

  const onSubmit = (fields: { rpcAddress: string } | { token: string }) => {
    if (infuraDialogOpen && 'token' in fields) {
      setInfuraDialogOpen(false)
      addProvider('infura', fields.token)
    }
    if (alchemyDialogOpen && 'token' in fields) {
      setInfuraDialogOpen(false)
      addProvider('alchemy', fields.token)
    }
    if (rpcDialogOpen && 'rpcAddress' in fields) {
      setRpcDialogOpen(false)
      addProvider('rpc', fields.rpcAddress)
    }
  }

  return (
    <FlexBox justify="center" align="center">
      <Button className="rpc-settings-icon" onClick={openDialog}>
        <SettingsIcon error={isCustom} />
      </Button>
      <Select options={options} value={selectedOption} onChange={onSelectedChange} />
      <RpcDialog open={rpcDialogOpen} onClose={() => setRpcDialogOpen(false)} onSubmit={onSubmit} />
      <InfuraDialog
        open={infuraDialogOpen}
        onClose={() => setInfuraDialogOpen(false)}
        onSubmit={onSubmit}
      />
      <AlchemyDialog
        open={alchemyDialogOpen}
        onClose={() => setAlchemyDialogOpen(false)}
        onSubmit={onSubmit}
      />
    </FlexBox>
  )
}

export default SourceSelector
