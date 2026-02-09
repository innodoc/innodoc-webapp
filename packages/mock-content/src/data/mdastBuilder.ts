import type {
  Code,
  Heading,
  List,
  ListContent,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
  RootContent,
  Text,
} from 'mdast'

const heading = (depth: number, children: PhrasingContent[]): Heading => {
  if (depth < 1 || depth > 6) {
    throw new Error(`Invalid depth: ${depth}`)
  }
  return {
    children,
    type: 'heading',
    depth: depth as 1 | 2 | 3 | 4 | 5 | 6,
  }
}

const root = (children: RootContent[]): Root => ({ type: 'root', children })

const code = (lang: string, value: string): Code => ({ type: 'code', value, lang })

const list = (ordered: 'ordered' | 'unordered', children: ListContent[]): List => ({
  type: 'list',
  children,
  ordered: ordered === 'ordered',
})

const listItem = (children: ListItem['children']): ListItem => ({ type: 'listItem', children })

const paragraph = (children: Paragraph['children']): Paragraph => ({ type: 'paragraph', children })

const text = (value: string): Text => ({ type: 'text', value })

export { code, heading, list, listItem, paragraph, root, text }
