import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '../../ContentFragment'

const ExerciseCard = ({ t, content }) => (
  <Card className="exercise" color="green" fluid>
    <Card.Content>
      <Card.Header>
        {t('content.exercise')}
      </Card.Header>
      <Card.Description>
        <ContentFragment content={content} />
      </Card.Description>
    </Card.Content>
  </Card>
)

ExerciseCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default translate()(ExerciseCard)
