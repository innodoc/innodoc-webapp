import { createContext, useMemo, type ReactNode } from 'react'

function createWorker() {
  if (!import.meta.env.SSR) {
    return new Worker(new URL('./worker', import.meta.url), { type: 'module' })
  }
  return undefined
}

const MarkdownWorkerContext = createContext<Worker | undefined>(undefined)

function MarkdownWorkerProvider({ children }: MarkdownWorkerProviderProps) {
  const worker = useMemo(createWorker, [])
  return <MarkdownWorkerContext.Provider value={worker}>{children}</MarkdownWorkerContext.Provider>
}

interface MarkdownWorkerProviderProps {
  children: ReactNode
}

export { MarkdownWorkerProvider }
export default MarkdownWorkerContext
