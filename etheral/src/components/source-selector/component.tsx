import { useState } from 'react'
import { Button, FlexBox, Select } from '@components'
import './component.scss'
import { InfuraDialog } from './infura-dialog'
import { RpcDialog } from './rpc-dialog'
import { SettingsIcon } from './settings-icon'

const options = ['Infura', 'JsonRPC server']

export const SourceSelector = () => {
  const [rpcDialogOpen, setRpcDialogOpen] = useState(false)
  const [infuraDialogOpen, setInfuraDialogOpen] = useState(false)
  const [selectedOption, setSelectedOption] = useState(options[0])
  const isCustom = selectedOption === 'JsonRPC server'
  const isInfura = selectedOption === 'Infura'

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
  }

  const onSubmit = (fields: Record<string, unknown>) => {
    if (infuraDialogOpen) {
      setInfuraDialogOpen(false)
    }
    if (rpcDialogOpen) {
      setRpcDialogOpen(false)
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
    </FlexBox>
  )
}

export default SourceSelector
