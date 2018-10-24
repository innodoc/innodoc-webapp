import React from 'react'
import PropTypes from 'prop-types'
import { Card, Icon } from 'semantic-ui-react'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const InfoCard = ({ t, content }) => (
  <Card className="info" color="blue" fluid>
    <Card.Content>
      <Card.Header>
        <Icon name="info circle" size="large" color="blue" />
        {t('content.info')}
      </Card.Header>
      <Card.Description>
        <ContentFragment content={content} />
      </Card.Description>
    </Card.Content>
  </Card>
)

InfoCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(InfoCard)
