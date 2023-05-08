export type Storage = {
  enableRichMode: boolean
}

export type IPersistStorageContext = {
  storage: Storage
  setRichMode: (f: boolean) => void
}
