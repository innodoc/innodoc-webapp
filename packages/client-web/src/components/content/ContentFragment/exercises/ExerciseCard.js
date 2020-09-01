import React from 'react'
import PropTypes from 'prop-types'
import { FormOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'
import { attributeType, contentType } from '@innodoc/client-misc/src/propTypes'
import { getNumberedTitle } from '@innodoc/client-misc/src/util'

import Card from '../cards/Card'
import { ExerciseProvider } from './ExerciseContext'

const ExerciseCard = ({ attributes, content, id }) => {
  const { t } = useTranslation()
  return (
    <ExerciseProvider id={id}>
      <Card
        title={getNumberedTitle(t('content.exercise'), attributes)}
        cardType="exercise"
        icon={<FormOutlined />}
        content={content}
        id={id}
      />
    </ExerciseProvider>
  )
}

ExerciseCard.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  id: PropTypes.string,
}

ExerciseCard.defaultProps = {
  id: null,
}

export default ExerciseCard
