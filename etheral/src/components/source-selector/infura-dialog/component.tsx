import { useState } from 'react'
import { Button, Container, Dialog, Input } from '@components'
import '../rpc-dialog/component.scss'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: Record<string, unknown>) => void
}

export const InfuraDialog = ({ open, onClose, onSubmit }: Props) => {
  const [infuraToken, setInfuraToken] = useState('')
  
  const onSave = () => {
    onSubmit({
      infuraToken,
    })
  }
  return (
    <Dialog open={open}>
      <Container className="selector-dialog">
        <div className="selector-dialog-container">
          <div className="selector-dialog-line">
            <label htmlFor="infura-dialog-token">Infura API token:</label>
            <Input
              value={infuraToken}
              onChange={(e) => setInfuraToken((e.target as HTMLInputElement).value)}
              id="infura-dialog-token"
            />
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
