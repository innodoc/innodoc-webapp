import type { ComponentType, ReactNode } from 'react'
import { isHastMdxJsxFlowDivElement, isHastRootDivElement } from '@innodoc/content-parser/typeguards'
import type { HastMdxJsxFlowDivElement } from '@innodoc/content-parser/types'
import { ExampleCard, ExerciseCard, HintCard, InfoCard, InputHintCard, SolutionCard } from '#cards'
import { TextQuestion } from '#exercises'
import { Grid, GridItem } from '#grid'
import type { HastComponentProps } from '#hast'
import { TableContainer } from '#misc'
import { TabItem, Tabs } from '#tabs'
import { Video, YouTubeVideo } from '#video'

interface DivComponentProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxFlowDivElement['properties']
}

type DivComponent = ComponentType<DivComponentProps>

const flowDivComponentMap: Partial<Record<HastMdxJsxFlowDivElement['properties']['name'], DivComponent>> = {
  // cards
  Example: ExampleCard,
  Exercise: ExerciseCard,
  Hint: HintCard,
  Info: InfoCard,
  InputHint: InputHintCard,
  Solution: SolutionCard,

  // questions
  TextQuestion,

  // grid
  Grid,
  GridItem,

  // table
  Table: TableContainer,

  // tabs
  Tabs,
  TabItem,

  // video
  Video,
  YouTube: YouTubeVideo,
}

function DivNode({ children, id, node }: HastComponentProps<'div'>) {
  // Document root, avoid wrapping in <div>
  // https://github.com/rehypejs/rehype-react/issues/36
  if (isHastRootDivElement(node)) {
    return <>{children}</>
  }

  if (isHastMdxJsxFlowDivElement(node)) {
    // At runtime `name` can be any authored JSX tag (a raw `<div>` written in MDX parses as a
    // flow element named `div`), so unmapped names fall back to the bare div below.
    const Component = flowDivComponentMap[node.properties.name]

    if (Component) {
      return (
        <Component id={id} nodeProps={node.properties}>
          {children}
        </Component>
      )
    }
  }

  return <div>{children}</div>
}

export default DivNode
