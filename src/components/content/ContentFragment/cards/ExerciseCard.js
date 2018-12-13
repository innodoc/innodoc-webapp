import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const ExerciseCard = ({ t, content, id }) => (
  <Card
    title={t('content.exercise')}
    cardType="exercise"
    icon="form"
    content={content}
    id={id}
  />
)

ExerciseCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
}

ExerciseCard.defaultProps = {
  id: null,
}

export default withNamespaces()(ExerciseCard)
