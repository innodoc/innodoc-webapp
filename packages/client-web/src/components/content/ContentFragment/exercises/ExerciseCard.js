import React from 'react'
import PropTypes from 'prop-types'
import { FormOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'
import { attributeType, contentType } from '@innodoc/client-misc/src/propTypes'
import { getNumberedTitle } from '@innodoc/client-misc/src/util'

import Card from '../cards/Card'
import { ExerciseProvider } from './ExerciseContext'

const ExerciseCard = ({ attributes, content, extra, id }) => {
  const { t } = useTranslation()
  return (
    <ExerciseProvider id={id}>
      <Card
        cardType="exercise"
        content={content}
        extra={extra}
        icon={<FormOutlined />}
        id={id}
        title={getNumberedTitle(t('content.exercise'), attributes)}
      />
    </ExerciseProvider>
  )
}

ExerciseCard.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  extra: PropTypes.node,
  id: PropTypes.string,
}

ExerciseCard.defaultProps = {
  extra: null,
  id: null,
}

export default ExerciseCard
