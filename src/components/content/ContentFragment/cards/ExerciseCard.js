import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const ExerciseCard = ({ t, content }) => (
  <Card
    title={t('content.exercise')}
    cardType="exercise"
    iconType="form"
    content={content}
  />
)

ExerciseCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(ExerciseCard)
