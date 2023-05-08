import { createContext, useContext, useEffect, useState } from 'react'
import type { IPersistStorageContext, Storage } from './context.types'

const PersistStorageContext = createContext<IPersistStorageContext>(
  undefined as unknown as IPersistStorageContext,
)

export const usePersistStorage = () => useContext<IPersistStorageContext>(PersistStorageContext)

type Props = {
  children: React.ReactNode
}

export const PersistStorageProvider = ({ children }: Props) => {
  const [storage, setPersistStorage] = useState<Storage>({
    enableRichMode: false,
  })

  useEffect(() => {
    const status = localStorage.getItem('enableRichMode') === 'true'
    setPersistStorage({
      enableRichMode: status,
    })
  }, [])

  useEffect(() => {
    Object.keys(storage).forEach((key) => {
      localStorage.setItem(key, String(storage[key as keyof Storage]))
    })
  }, [storage])

  const setRichMode = (status: boolean) => {
    setPersistStorage({
      enableRichMode: status,
    })
  }

  return (
    <PersistStorageContext.Provider value={{ storage, setRichMode }}>
      {children}
    </PersistStorageContext.Provider>
  )
}
