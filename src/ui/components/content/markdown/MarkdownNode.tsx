import { useContext, useEffect } from 'react'

import RouteTransitionContext from '#ui/contexts/RouteTransitionContext'
import useMarkdownToReact from '#ui/hooks/useMarkdownToReact'

function MarkdownNode({ content: markdownCode }: MarkdownNodeProps) {
  const { content, isPending } = useMarkdownToReact(markdownCode)
  const { addToken, removeToken } = useContext(RouteTransitionContext)

  useEffect(() => {
    if (isPending) {
      addToken('md-processing')
    } else {
      removeToken('md-processing')
    }
  }, [addToken, isPending, removeToken])

  return content
}

interface MarkdownNodeProps {
  content: string
}

export default MarkdownNode
