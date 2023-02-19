// TODO: replace with https://unifiedjs.com/learn/recipe/narrow-node-typescript/
// https://github.com/syntax-tree/unist-util-is

import type {
  BlockContent,
  Blockquote,
  Break,
  Code,
  Definition,
  DefinitionContent,
  Delete,
  Emphasis,
  Footnote,
  FootnoteDefinition,
  FootnoteReference,
  FrontmatterContent,
  Heading,
  HTML,
  Image,
  ImageReference,
  InlineCode,
  Link,
  LinkReference,
  List,
  ListContent,
  ListItem,
  Paragraph,
  PhrasingContent,
  Root,
  RowContent,
  StaticPhrasingContent,
  Strong,
  Table,
  TableCell,
  TableContent,
  TableRow,
  Text,
  ThematicBreak,
  TopLevelContent,
  YAML,
} from 'mdast'
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive'
import type { Node } from 'unist'
import { convert } from 'unist-util-is'

export const isRoot = convert<Root>('root')

export function isTopLevelContent(node: Node): node is TopLevelContent {
  return isBlockContent(node) || isFrontmatterContent(node) || isDefinitionContent(node)
}

export function isBlockContent(node: Node): node is BlockContent {
  return [
    'paragraph',
    'heading',
    'thematicBreak',
    'blockquote',
    'list',
    'table',
    'html',
    'code',
    'leafDirective',
    'containerDirective',
  ].includes(node.type)
}

export function isFrontmatterContent(node: Node): node is FrontmatterContent {
  return node.type === 'yaml'
}

export function isDefinitionContent(node: Node): node is DefinitionContent {
  return ['definition', 'footnoteDefinition'].includes(node.type)
}

export function isListContent(node: Node): node is ListContent {
  return node.type === 'listItem'
}

export function isTableContent(node: Node): node is TableContent {
  return node.type === 'tableRow'
}

export function isRowContent(node: Node): node is RowContent {
  return node.type === 'tableCell'
}

export function isPhrasingContent(node: Node): node is PhrasingContent {
  return isStaticPhrasingContent(node) || ['link', 'linkReference'].includes(node.type)
}

export function isStaticPhrasingContent(node: Node): node is StaticPhrasingContent {
  return [
    'text',
    'emphasis',
    'strong',
    'delete',
    'html',
    'inlineCode',
    'break',
    'image',
    'imageReference',
    'footnote',
    'footnoteReference',
    'textDirective',
  ].includes(node.type)
}

export function isParagraph(node: Node): node is Paragraph {
  return node.type === 'paragraph'
}

export function isHeading(node: Node): node is Heading {
  return node.type === 'heading'
}

export function isThematicBreak(node: Node): node is ThematicBreak {
  return node.type === 'thematicBreak'
}

export function isBlockquote(node: Node): node is Blockquote {
  return node.type === 'blockquote'
}

export function isList(node: Node): node is List {
  return node.type === 'list'
}

export function isListItem(node: Node): node is ListItem {
  return node.type === 'listItem'
}

export function isTable(node: Node): node is Table {
  return node.type === 'table'
}

export function isTableRow(node: Node): node is TableRow {
  return node.type === 'tableRow'
}

export function isTableCell(node: Node): node is TableCell {
  return node.type === 'tableCell'
}

export function isHTML(node: Node): node is HTML {
  return node.type === 'html'
}

export function isCode(node: Node): node is Code {
  return node.type === 'code'
}

export function isYAML(node: Node): node is YAML {
  return node.type === 'yaml'
}

export function isDefinition(node: Node): node is Definition {
  return node.type === 'definition'
}

export function isFootnoteDefinition(node: Node): node is FootnoteDefinition {
  return node.type === 'footnoteDefinition'
}

export function isText(node: Node): node is Text {
  return node.type === 'text'
}

export function isEmphasis(node: Node): node is Emphasis {
  return node.type === 'emphasis'
}

export function isStrong(node: Node): node is Strong {
  return node.type === 'strong'
}

export function isDelete(node: Node): node is Delete {
  return node.type === 'delete'
}

export function isInlineCode(node: Node): node is InlineCode {
  return node.type === 'inlineCode'
}

export function isBreak(node: Node): node is Break {
  return node.type === 'break'
}

export function isLink(node: Node): node is Link {
  return node.type === 'link'
}

export function isImage(node: Node): node is Image {
  return node.type === 'image'
}

export function isLinkReference(node: Node): node is LinkReference {
  return node.type === 'linkReference'
}

export function isImageReference(node: Node): node is ImageReference {
  return node.type === 'imageReference'
}

export function isFootnote(node: Node): node is Footnote {
  return node.type === 'footnote'
}

export function isFootnoteReference(node: Node): node is FootnoteReference {
  return node.type === 'footnoteReference'
}

export function isTextDirective(node: Node): node is TextDirective {
  return node.type === 'textDirective'
}

export function isLeafDirective(node: Node): node is LeafDirective {
  return node.type === 'leafDirective'
}

export function isContainerDirective(node: Node): node is ContainerDirective {
  return node.type === 'containerDirective'
}
