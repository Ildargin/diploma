import { useState } from 'react'
import { Button, Container, Dialog, Input } from '@components'
import '../rpc-dialog/component.scss'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: { token: string }) => void
}

export const InfuraDialog = ({ open, onClose, onSubmit }: Props) => {
  const [token, setToken] = useState(
    'https://sepolia.infura.io/v3/0d6970b0645847c9b3a651c4322a5ff1',
  )

  const onSave = () => {
    onSubmit({
      token,
    })
  }
  return (
    <Dialog open={open}>
      <Container className="selector-dialog">
        <div className="selector-dialog-container">
          <div className="selector-dialog-line">
            <label htmlFor="infura-dialog-token">Infura API token:</label>
            <Input
              value={token}
              onChange={(e) => setToken((e.target as HTMLInputElement).value)}
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
