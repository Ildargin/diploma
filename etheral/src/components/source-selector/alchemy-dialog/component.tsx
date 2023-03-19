import { useState } from 'react'
import { Button, Container, Dialog, Input } from '@components'
import '../rpc-dialog/component.scss'

type Props = {
  open: boolean
  onClose: () => void
  onSubmit: (values: { token: string }) => void
}

export const AlchemyDialog = ({ open, onClose, onSubmit }: Props) => {
  const [token, setToken] = useState(
    'https://eth-goerli.g.alchemy.com/v2/amhTc8q9j-3DdYhEhZn79Qz1yZgp3Pyl',
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
            <label htmlFor="infura-dialog-token">Alchemy API token:</label>
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
