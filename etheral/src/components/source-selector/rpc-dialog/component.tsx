import { useState } from 'react'
import { Button, Checkbox, Container, Dialog, Input } from '@components'
import './component.scss'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: { rpcAddress: string; enableRichMode: boolean }) => void
}

export const RpcDialog = ({ open, onClose, onSubmit }: Props) => {
  const [enableRichMode, setEnableRichMode] = useState(false)
  const [rpcAddress, setRpcAddress] = useState('http://127.0.0.1:3002')

  const onSave = () => {
    onSubmit({
      rpcAddress,
      enableRichMode,
    })
  }

  return (
    <Dialog open={open}>
      <Container className="selector-dialog">
        <div className="selector-dialog-container">
          <div className="selector-dialog-line">
            <label htmlFor="jsonRpc-field">JSON RPC server address</label>
            <Input
              id="jsonRpc-field"
              value={rpcAddress}
              onChange={(e) => setRpcAddress((e.target as HTMLInputElement).value)}
            />
          </div>
          <div className="selector-dialog-line">
            <label htmlFor="jsonRpc-field">
              Enable visulization tools - requires parsing and synchronization time
            </label>
            <div style={{ margin: '0 10px' }}>
              <Checkbox checked={enableRichMode} onChange={(status) => setEnableRichMode(status)} />
            </div>
          </div>
        </div>
        <div className="selector-dialog-buttons">
          <Button onClick={onSave}>Save</Button>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Container>
    </Dialog>
  )
}
