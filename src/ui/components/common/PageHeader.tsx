import { Typography } from '@mui/material'
import type { ReactNode } from 'react'

import Icon, { type IconProps } from './Icon'

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

interface PageHeaderProps {
  children: ReactNode
  iconName?: IconProps['name']
}

export default PageHeader
