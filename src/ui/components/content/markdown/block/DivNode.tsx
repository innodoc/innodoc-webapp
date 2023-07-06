import { isMdxJsxFlowDivElement, isRootDivElement } from '#markdown/hastToReact/typeGuards'
import ExampleCard from '#ui/components/content/cards/ExampleCard'
import ExerciseCard from '#ui/components/content/cards/ExerciseCard'
import HintCard from '#ui/components/content/cards/HintCard'
import InfoCard from '#ui/components/content/cards/InfoCard'
import InputHintCard from '#ui/components/content/cards/InputHintCard'
import SolutionCard from '#ui/components/content/cards/SolutionCard'
import Grid from '#ui/components/content/grid/Grid'
import GridItem from '#ui/components/content/grid/GridItem'
import type { MarkdownComponentProps } from '#ui/components/content/markdown/types'
import TableContainer from '#ui/components/content/misc/TableContainer'
import TabItem from '#ui/components/content/tabs/TabItem'
import Tabs from '#ui/components/content/tabs/Tabs'

const flowDivComponentMap = {
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

export type MdxJsxFlowDivElementName = keyof typeof flowDivComponentMap

function DivNode({ children, id, node }: MarkdownComponentProps<'div'>) {
  // Document root, avoid wrapping in <div>
  // https://github.com/rehypejs/rehype-react/issues/36
  if (isRootDivElement(node)) {
    return <>{children}</>
  }

  if (isMdxJsxFlowDivElement(node)) {
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
