import { Paper } from '@mui/material'
import type { ReactNode } from 'react'

function TableContainer({ children, id }: TableContainerProps) {
  return <Paper id={id}>{children}</Paper>
}

interface TableContainerProps {
  children: ReactNode
  id?: string
}

export default TableContainer
