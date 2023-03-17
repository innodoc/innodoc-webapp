import { createContext, useCallback, useState, type ReactNode } from 'react'

interface RouteTransitionContextValue {
  addToken: (token: string) => void
  removeToken: (token: string) => void
  pageReady: boolean
}

/**
 * Keep track of tokens which indicate page rendering is pending. Allows to
 * defer route fade in from deep inside the component tree.
 */
const RouteTransitionContext = createContext<RouteTransitionContextValue>({
  addToken: () => undefined,
  removeToken: () => undefined,
  pageReady: true,
})

function RouteTransitionProvider({ children }: RouteTransitionProviderProps) {
  const [tokens, setTokens] = useState(new Set<string>())

  const addToken = useCallback(
    (token: string) => setTokens((prevTokens) => new Set([...prevTokens, token])),
    []
  )

  const removeToken = useCallback(
    (token: string) =>
      setTokens((prevTokens) => new Set([...prevTokens].filter((t) => t !== token))),
    []
  )

  const value = {
    addToken,
    removeToken,
    pageReady: tokens.size < 1,
  }

  return <RouteTransitionContext.Provider value={value}>{children}</RouteTransitionContext.Provider>
}

interface RouteTransitionProviderProps {
  children: ReactNode
}

export { RouteTransitionProvider }
export default RouteTransitionContext
