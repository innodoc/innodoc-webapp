import type { DefinitionContentMap } from 'mdast'
import { createContext, type ReactNode } from 'react'

import type { MarkdownDoc } from '#types/entities/markdown'

type IndexContextValueType = <T extends keyof DefinitionContentMap>(
  type: T,
  identifier: string
) => DefinitionContentMap[T] | undefined

const IndexContext = createContext<IndexContextValueType>(() => undefined)

/** Make indices available to subtree */
export function IndexProvider({ children, indices }: IndexProviderProps) {
  const getEntry: IndexContextValueType = (type, identifier) => indices?.[type]?.[identifier]
  return <IndexContext.Provider value={getEntry}>{children}</IndexContext.Provider>
}

interface IndexProviderProps {
  children: ReactNode
  indices: MarkdownDoc['indices']
}

export default IndexContext
