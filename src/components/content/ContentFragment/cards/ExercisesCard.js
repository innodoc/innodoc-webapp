import React from 'react'
import PropTypes from 'prop-types'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const ExercisesCard = ({ t, content }) => (
  <Card
    title={t('content.exercises')}
    cardType="exercises"
    iconType="copy"
    content={content}
  />
)

ExercisesCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(ExercisesCard)
