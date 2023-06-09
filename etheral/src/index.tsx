import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Footer, Navigation } from '@components'
import {
  ChainDataProvider,
  PersistStorageProvider,
  ToastProvider,
  WalletProvider,
  Web3Provider,
} from '@contexts'
import { Address, App, Block, Connections, Tx, Visualize } from '@pages'
import './index.scss'

const container = document.getElementById('app') as HTMLElement
const root = createRoot(container)
const queryClient = new QueryClient()

root.render(
  <StrictMode>
    <Web3Provider>
      <ToastProvider>
        <PersistStorageProvider>
          <WalletProvider>
            <ChainDataProvider>
              <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                  <Navigation />
                  <Routes>
                    <Route path="/address/:id" element={<Address />} />
                    <Route path="/tx/:id" element={<Tx />} />
                    <Route path="/block/:id" element={<Block />} />
                    <Route path="/visualize/:id" element={<Visualize />} />
                    <Route path="/connections/:id" element={<Connections />} />
                    <Route path="*" element={<App />} />
                  </Routes>
                  <Footer />
                </BrowserRouter>
              </QueryClientProvider>
            </ChainDataProvider>
          </WalletProvider>
        </PersistStorageProvider>
      </ToastProvider>
    </Web3Provider>
  </StrictMode>,
)
