import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const ExercisesCard = ({ t, content }) => (
  <Card className="exercises" color="orange" fluid>
    <Card.Content>
      <Card.Header>
        {t('content.exercises')}
      </Card.Header>
      <Card.Description color="orange">
        <ContentFragment content={content} />
      </Card.Description>
    </Card.Content>
  </Card>
)

ExercisesCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default translate()(ExercisesCard)
