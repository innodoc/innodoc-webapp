import { Typography } from '@mui/material'
import { ReactNode } from 'react'

function PageHeader({ children }: PageHeaderProps) {
  return (
    <Typography gutterBottom variant="h1">
      {children}
    </Typography>
  )
}

type PageHeaderProps = {
  children: ReactNode
}

export default PageHeader
