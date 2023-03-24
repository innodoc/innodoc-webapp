import type { Element as HastElement } from 'hast'
import type { ReactNode } from 'react'

import ExampleCard from '#ui/components/content/cards/ExampleCard'
import ExerciseCard from '#ui/components/content/cards/ExerciseCard'
import HintCard from '#ui/components/content/cards/HintCard'
import InfoCard from '#ui/components/content/cards/InfoCard'
import InputHintCard from '#ui/components/content/cards/InputHintCard'
import SolutionCard from '#ui/components/content/cards/SolutionCard'
import Grid from '#ui/components/content/grid/Grid'
import GridItem from '#ui/components/content/grid/GridItem'

const componentMap = {
  // cards
  example: ExampleCard,
  exercise: ExerciseCard,
  hint: HintCard,
  info: InfoCard,
  'input-hint': InputHintCard,
  solution: SolutionCard,

  // grid
  grid: Grid,
  'grid-item': GridItem,
}

type ContainerDirectiveName = keyof typeof componentMap

const containerDirectiveName = Object.keys(componentMap) as ContainerDirectiveName[]

function isContainerDirectiveName(name: unknown): name is ContainerDirectiveName {
  return typeof name === 'string' && containerDirectiveName.includes(name as ContainerDirectiveName)
}

function ContainerDirective({ children, node }: ContainerDirectiveProps) {
  const name = node.properties?.name
  if (isContainerDirectiveName(name)) {
    const Component = componentMap[name]
    return <Component nodeProps={node.properties ?? {}}>{children}</Component>
  }
  return null
}

interface ContainerDirectiveProps {
  children: ReactNode
  node: HastElement
}

export default ContainerDirective
