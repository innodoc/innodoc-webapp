import { Button } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import Icon from '#ui/components/common/Icon'
import ExerciseContext from '#ui/contexts/ExerciseContext'

import Card from './Card'
import type { ContentCardProps } from './types'

function ExerciseCard({ children }: ContentCardProps) {
  const { t } = useTranslation()
  // const title = useCardTitle(node.data?.id, t('content.exercise.title'))
  const title = t('content.exercise.title')

  // TODO id, title

  const handleClick = () => {
    console.log('CHECK')
  }

  const action = (
    <Button
      color="primary"
      onClick={handleClick}
      size="small"
      startIcon={<Icon name="mdi:check" />}
    >
      {t('content.exercise.verifyInput')}
    </Button>
  )

  const contextValue = useMemo(() => ({}), [])

  return (
    <ExerciseContext.Provider value={contextValue}>
      <Card
        actions={action}
        cardType="exercise"
        iconName="mdi:application-edit-outline"
        title={title}
      >
        {children}
      </Card>
    </ExerciseContext.Provider>
  )
}

export default ExerciseCard
