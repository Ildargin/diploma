import { useState } from 'react'
import { Button, FlexBox, Select } from '@components'
import { usePersistStorage, useWeb3 } from '@contexts'
import type { ProviderNames } from '@contexts'
import { AlchemyDialog } from './alchemy-dialog'
import './component.scss'
import { InfuraDialog } from './infura-dialog'
import { RpcDialog } from './rpc-dialog'
import { SettingsIcon } from './settings-icon'

const options: Record<ProviderNames, string> = {
  infura: 'Infura',
  rpc: 'JsonRPC server',
  alchemy: 'Alchemy',
}

export const SourceSelector = () => {
  const { storage, setRichMode } = usePersistStorage()
  const [rpcDialogOpen, setRpcDialogOpen] = useState(false)
  const [infuraDialogOpen, setInfuraDialogOpen] = useState(false)
  const [alchemyDialogOpen, setAlchemyDialogOpen] = useState(false)
  const { addProvider, web3 } = useWeb3()
  const [selectedOption, setSelectedOption] = useState(options[web3.active])
  const richModeOff = storage.enableRichMode === false
  console.log(richModeOff)
  const isCustom = selectedOption == options.rpc
  const isInfura = selectedOption == options.infura
  const isAlchemy = selectedOption == options.alchemy

  const onSelectedChange = (fieldName: string) => {
    setSelectedOption(fieldName)
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

  const onSubmit = (
    fields: { rpcAddress: string; enableRichMode: boolean } | { token: string },
  ) => {
    if (infuraDialogOpen && 'token' in fields) {
      setInfuraDialogOpen(false)
      addProvider('infura', fields.token)
    }
    if (alchemyDialogOpen && 'token' in fields) {
      setInfuraDialogOpen(false)
      addProvider('alchemy', fields.token)
    }
    if (rpcDialogOpen && 'rpcAddress' in fields && 'enableRichMode' in fields ) {
      setRichMode(fields.enableRichMode)
      setRpcDialogOpen(false)
      addProvider('rpc', fields.rpcAddress)
    }
  }

  return (
    <FlexBox justify="center" align="center">
      <Button className="rpc-settings-icon" onClick={openDialog}>
        <SettingsIcon error={isCustom && richModeOff} />
      </Button>
      <Select options={Object.values(options)} value={selectedOption} onChange={onSelectedChange} />
      <RpcDialog
        enableRichMode={storage.enableRichMode}
        onModeChange={setRichMode}
        open={rpcDialogOpen}
        onClose={() => setRpcDialogOpen(false)}
        onSubmit={onSubmit}
      />
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
