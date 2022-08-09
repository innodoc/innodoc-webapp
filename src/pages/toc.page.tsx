import { Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

function TocPage() {
  const { t } = useTranslation()

  return (
    <>
      <Typography variant="h1">{t('internalPages.toc')}</Typography>
    </>
  )
}

export { TocPage as Page }
