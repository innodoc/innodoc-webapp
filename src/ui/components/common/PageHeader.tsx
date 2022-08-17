import { Typography } from '@mui/material'
import { ReactNode } from 'react'

import Icon from './Icon'

function PageHeader({ children, iconName }: PageHeaderProps) {
  const icon =
    iconName !== undefined ? <Icon fontSize="inherit" name={iconName} sx={{ mr: 1 }} /> : null

  return (
    <Typography gutterBottom sx={{ alignItems: 'center', display: 'inline-flex' }} variant="h1">
      {icon}
      {children}
    </Typography>
  )
}

type PageHeaderProps = {
  children: ReactNode
  iconName?: string
}

export default PageHeader
