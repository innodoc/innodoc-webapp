import { Button } from '@mui/material'
import { useTranslation } from 'react-i18next'

import Code from '#ui/components/common/Code'
import BlockError from '#ui/components/common/error/BlockError'
import Icon from '#ui/components/common/Icon'

function RenderError({ error, resetErrorBoundary }: RenderErrorProps) {
  const { t } = useTranslation()

  const resetBtn = resetErrorBoundary ? (
    <Button startIcon={<Icon name="mdi:refresh" />} onClick={resetErrorBoundary}>
      {t('error.retry')}
    </Button>
  ) : undefined

  return (
    <BlockError action={resetBtn} title={t('error.markdownRenderingError')}>
      <Code>{error.message}</Code>
    </BlockError>
  )
}

interface RenderErrorProps {
  error: Error
  resetErrorBoundary?: () => void
}

export default RenderError
