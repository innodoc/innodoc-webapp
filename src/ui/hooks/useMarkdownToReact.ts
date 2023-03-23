import type { Root } from 'hast'
import { useCallback, useContext, useEffect, useState, useTransition } from 'react'

import hastToReact from '#markdown/hastToReact'
import { markdownToHastSync } from '#markdown/markdownToHast/markdownToHast'
import { selectIsHydration } from '#store/slices/appSlice'
import MarkdownWorkerContext from '#ui/contexts/MarkdownWorkerContext/MarkdownWorkerContext'

import { useSelector } from './store/store'

function useMarkdownToReact(markdownCode: string) {
  // Web worker for off-loading Markdown processing
  const worker = useContext(MarkdownWorkerContext)
  const [numJobs, setNumJobs] = useState(0)
  const isHydration = useSelector(selectIsHydration)

  // On the server and during hydration we do a sync transform
  const [isTransitionPending, startTransition] = useTransition()
  const [content, setContent] = useState<ReturnType<typeof hastToReact> | null>(() => {
    if (import.meta.env.SSR || isHydration) {
      return hastToReact(markdownToHastSync(markdownCode))
    }
    return null
  })

  const workerListener = useCallback((event: MessageEvent) => {
    startTransition(() => {
      setContent(hastToReact(event.data as Root))
      setNumJobs((oldNum) => oldNum - 1)
    })
  }, [])

  // Receive hast from worker
  useEffect(() => {
    if (worker) {
      worker.addEventListener('message', workerListener)

      return () => {
        worker.removeEventListener('message', workerListener)
      }
    }
  }, [worker, workerListener])

  // Send markdown to worker
  useEffect(() => {
    if (worker && !isHydration) {
      worker.postMessage(markdownCode)
      setNumJobs((oldNum) => oldNum + 1)
    }
  }, [isHydration, markdownCode, worker])

  return { content, isPending: numJobs > 0 || isTransitionPending }
}

export default useMarkdownToReact
