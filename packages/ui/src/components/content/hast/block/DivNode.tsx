import type { HastMdxJsxFlowDivElement } from '@innodoc/markdown/types'
import type { ComponentType, ReactNode } from 'react'

import { isHastMdxJsxFlowDivElement, isHastRootDivElement } from '@innodoc/markdown/type-guards'

import {
  ExampleCard,
  ExerciseCard,
  HintCard,
  InfoCard,
  InputHintCard,
  SolutionCard,
} from '#components/content/cards'
// import { TableContainer } from '#components/content/misc'
import { TabItem, Tabs } from '#components/content/tabs'
// import { Grid, GridItem } from '#components/content/grid'
import type { HastComponentProps } from '#components/content/hast'

interface DivComponentProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxFlowDivElement['properties']
}

type DivComponent = ComponentType<DivComponentProps>

const flowDivComponentMap: Record<HastMdxJsxFlowDivElement['properties']['name'], DivComponent> = {
  // cards
  Example: ExampleCard,
  Exercise: ExerciseCard,
  Hint: HintCard,
  Info: InfoCard,
  InputHint: InputHintCard,
  Solution: SolutionCard,

  // table
  // Table: TableContainer,

  // grid
  // Grid,
  // GridItem,

  // tabs
  Tabs,
  TabItem,
}

function DivNode({ children, id, node }: HastComponentProps<'div'>) {
  // Document root, avoid wrapping in <div>
  // https://github.com/rehypejs/rehype-react/issues/36
  if (isHastRootDivElement(node)) {
    return <>{children}</>
  }

  if (isHastMdxJsxFlowDivElement(node)) {
    const Component = flowDivComponentMap[node.properties.name]
    if (!Component) {
      return null
    }

    return (
      <Component id={id} nodeProps={node.properties}>
        {children}
      </Component>
    )
  }

  return <div>{children}</div>
}

export default DivNode
