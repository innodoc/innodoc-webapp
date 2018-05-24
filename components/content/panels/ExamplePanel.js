import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../lib/propTypes'
import ContentFragment from '../../ContentFragment'

const ExamplePanel = ({ t, content }) => (
  <Card color="yellow" fluid>
    <Card.Content>
      <Card.Header>
        {t('content.example')}
      </Card.Header>
      <Card.Description color="yellow">
        <ContentFragment content={content} />
      </Card.Description>
    </Card.Content>
  </Card>
)

ExamplePanel.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default translate()(ExamplePanel)
