import { TreeItem, type TreeItemProps } from '@mui/x-tree-view'

function TocTreeItem({ itemId }: TreeItemProps) {
  // const children = sections.map((s) => <TocTreeItem key={s.id} itemId={s.path} section={s} />)

  // TODO: https://mui.com/x/react-tree-view/rich-tree-view/items/
  return <TreeItem itemId={itemId} />
}

export default TocTreeItem

// import { styled } from '@mui/material'
// import { TreeItem, type TreeItemProps } from '@mui/x-tree-view'

// import { useSelectSectionChildren } from '@innodoc/shared-store/hooks'
// import type { TranslatedSection } from '@innodoc/shared-core/types'

// import TocTreeItemContent from './TocTreeItemContent.tsx_OLD'

// const StyledTreeItem = styled(TreeItem)(({ theme }) => ({
//   '& .MuiTreeItem-iconContainer': {
//     marginRight: theme.spacing(1) + ' !important',
//   },
// }))

// const CustomTreeItem = (props: CustomTreeItemProps) => (
//   <StyledTreeItem ContentComponent={TocTreeItemContent} label="" {...props}></StyledTreeItem>
// )

// type CustomTreeItemProps = TreeItemProps & { ContentProps: { section: TranslatedSection } }

// function TocTreeItem({ section, itemId }: TocTreeItemProps) {
//   const { sections } = useSelectSectionChildren(section.id)

//   const children = sections.map((s) => <TocTreeItem key={s.id} itemId={s.path} section={s} />)

//   return (
//     <CustomTreeItem ContentProps={{ section }} itemId={itemId}>
//       {children}
//     </CustomTreeItem>
//   )
// }

// // declare module '@mui/x-tree-view/TreeItem' {
// //   interface TreeItemContentProps {
// //     section: TranslatedSection
// //   }
// // }

// interface TocTreeItemProps extends TreeItemProps {
//   section: TranslatedSection
// }

// export default TocTreeItem
