import { useContext, useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import RouteTransitionContext from '#ui/contexts/RouteTransitionContext'
import useMarkdownToReact from '#ui/hooks/useMarkdownToReact'

import RenderError from './RenderError'

function MarkdownNode({ content: markdownCode }: MarkdownNodeProps) {
  const { content, error, isPending } = useMarkdownToReact(markdownCode)
  const { addToken, removeToken } = useContext(RouteTransitionContext)

  useEffect(() => {
    if (isPending) {
      addToken('md-processing')
    } else {
      removeToken('md-processing')
    }
  }, [addToken, isPending, removeToken])

  if (error) {
    return <RenderError error={error} />
  }

  return <ErrorBoundary FallbackComponent={RenderError}>{content}</ErrorBoundary>
}

interface MarkdownNodeProps {
  content: string
}

export default MarkdownNode
