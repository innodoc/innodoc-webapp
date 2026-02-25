/* eslint-disable unicorn/no-empty-file */

// // TODO delete

// import type { Element as HastElement } from 'hast'
// import type { ReactNode } from 'react'

// import { ExampleCard, ExerciseCard, HintCard, InfoCard, InputHintCard, SolutionCard } from '#content/cards'
// import { Grid, GridItem } from '#content/grid'
// import { TableContainer } from '#content/misc'
// import { TabItem, Tabs } from '#content/tabs'

// const componentMap = {
//   // cards
//   example: ExampleCard,
//   exercise: ExerciseCard,
//   hint: HintCard,
//   info: InfoCard,
//   'input-hint': InputHintCard,
//   solution: SolutionCard,

//   // table
//   table: TableContainer,

//   // grid
//   grid: Grid,
//   'grid-item': GridItem,

//   // tabs
//   tabs: Tabs,
//   'tab-item': TabItem,
// }

// type ContainerDirectiveName = keyof typeof componentMap

// const containerDirectiveName = Object.keys(componentMap) as ContainerDirectiveName[]

// function isContainerDirectiveName(name: unknown): name is ContainerDirectiveName {
//   return typeof name === 'string' && containerDirectiveName.includes(name as ContainerDirectiveName)
// }

// function ContainerDirective({ children, id, node }: ContainerDirectiveProps) {
//   const name = node.properties.name
//   if (isContainerDirectiveName(name)) {
//     const Component = componentMap[name]
//     return (
//       <Component id={id} nodeProps={node.properties ?? {}}>
//         {children}
//       </Component>
//     )
//   }
//   return null
// }

// interface ContainerDirectiveProps {
//   children: ReactNode
//   node: HastElement
//   id?: string
// }

// export default ContainerDirective
