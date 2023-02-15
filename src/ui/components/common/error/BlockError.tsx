import { Alert, AlertTitle } from '@mui/material'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

function BlockError({ children }: BlockErrorProps) {
  const { t } = useTranslation()

  return (
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>{t('common.error')}</AlertTitle>
      {children}
    </Alert>
  )
}

interface BlockErrorProps {
  children: ReactNode
}

export default BlockError
