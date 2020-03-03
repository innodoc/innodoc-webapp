import React from 'react'
import PropTypes from 'prop-types'
import { FormOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { contentType } from '@innodoc/client-misc/src/propTypes'

import Card from '../Card'
import ExerciseProvider from './ExerciseProvider'

const ExerciseCard = ({ content, id }) => {
  const { t } = useTranslation()
  return (
    <ExerciseProvider>
      <Card
        title={t('content.exercise')}
        cardType="exercise"
        icon={<FormOutlined />}
        content={content}
        id={id}
      />
    </ExerciseProvider>
  )
}

ExerciseCard.propTypes = {
  content: contentType.isRequired,
  id: PropTypes.string,
}

ExerciseCard.defaultProps = {
  id: null,
}

export default ExerciseCard
