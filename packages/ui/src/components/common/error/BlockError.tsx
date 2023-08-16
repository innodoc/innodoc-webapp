import { Alert, AlertTitle } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

function BlockError({ action, children, title = null }: BlockErrorProps) {
  const { t } = useTranslation()

  return (
    <Alert action={action} elevation={1} severity="error" sx={{ mb: 2 }}>
      <AlertTitle>{title ?? t('common.error')}</AlertTitle>
      {children}
    </Alert>
  )
}

interface BlockErrorProps {
  action?: ReactNode
  children: ReactNode
  title?: string | null
}

export default BlockError
