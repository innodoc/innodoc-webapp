import { Alert, AlertTitle, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { Icon } from '#components/common/misc'

import type { ContentCardProps } from './types'

const StyledAlert = styled(Alert)({
  paddingBottom: 0,
  '& > :last-child, & > .MuiAlert-icon': {
    paddingBottom: 0,
  },
})

function InputHintCard({ children, id }: ContentCardProps) {
  const { t } = useTranslation()

  // TODO title

  return (
    <StyledAlert
      icon={<Icon name="mdi:keyboard-outline" />}
      id={id}
      severity="info"
      variant="outlined"
    >
      <AlertTitle>{t('content.inputHint')}</AlertTitle>
      {children}
    </StyledAlert>
  )
}

export default InputHintCard
