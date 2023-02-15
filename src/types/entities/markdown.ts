import type { DefinitionContentMap, Root } from 'mdast'

export const indexTypes: ReadonlyArray<keyof DefinitionContentMap> = [
  'definition',
  'footnoteDefinition',
]

export interface MarkdownDoc {
  /** mdast root node */
  root: Root

  /** Index data for faster rendering */
  indices: {
    [Key in keyof DefinitionContentMap]?: Record<string, DefinitionContentMap[Key]>
  }
}
