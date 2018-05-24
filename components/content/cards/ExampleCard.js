import React from 'react'
import PropTypes from 'prop-types'
import { Card, Icon } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../lib/propTypes'
import ContentFragment from '../../ContentFragment'

const ExampleCard = ({ t, content }) => (
  <Card className="example" color="orange" fluid>
    <Card.Content>
      <Card.Header>
        <Icon name="star" size="large" color="orange" />
        {t('content.example')}
      </Card.Header>
      <Card.Description color="orange">
        <ContentFragment content={content} />
      </Card.Description>
    </Card.Content>
  </Card>
)

ExampleCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default translate()(ExampleCard)
