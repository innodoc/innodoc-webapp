import { Button } from '@mui/material'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { Icon } from '@innodoc/ui-design-system/misc'
import { ExerciseContext } from '@innodoc/ui-shared/contexts'

import Card from './Card.js'
import type { ContentCardProps } from './types.js'

const handleClick = () => {
  console.log('CHECK')
}

function ExerciseCard({ children, id }: ContentCardProps) {
  const { t } = useTranslation()
  // const title = useCardTitle(node.data?.id, t('content.exercise.title'))
  const title = t('content.exercise.title')

  // TODO title

  const action = (
    <Button color="primary" onClick={handleClick} size="small" startIcon={<Icon name="mdi:check" />}>
      {t('content.exercise.verifyInput')}
    </Button>
  )

  return (
    <ExerciseContext.Provider value={useMemo(() => ({}), [])}>
      <Card actions={action} cardType="exercise" iconName="mdi:application-edit-outline" id={id} title={title}>
        {children}
      </Card>
    </ExerciseContext.Provider>
  )
}

export default ExerciseCard
