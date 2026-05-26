import type { ReactNode } from 'react'
import { Paper } from '@mui/material'

function TableContainer({ children, id }: TableContainerProps) {
  return <Paper id={id}>{children}</Paper>
}

interface TableContainerProps {
  children: ReactNode
  id?: string
}

export default TableContainer
