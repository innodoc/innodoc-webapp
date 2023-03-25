import type { Element } from 'hast'
import type { Root } from 'mdast'
import type { ContainerDirective, LeafDirective, TextDirective } from 'mdast-util-directive'
import { convert } from 'unist-util-is'

export const isRoot = convert<Root>('root')

export const isContainerDirective = convert<ContainerDirective>('containerDirective')

export const isLeafDirective = convert<LeafDirective>('leafDirective')

export const isTextDirective = convert<TextDirective>('textDirective')

export const isElement = convert<Element>('element')
