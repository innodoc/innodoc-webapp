import React from 'react'
import PropTypes from 'prop-types'
import { Card, Icon } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '../../ContentFragment'

const TestCard = ({ t, content }) => (
  <Card className="info" color="violet" fluid>
    <Card.Content>
      <Card.Header>
        <Icon.Group size="large">
          <Icon name="file outline" color="violet" />
          <Icon corner name="pencil" color="violet" />
        </Icon.Group>
        {t('content.test')}
      </Card.Header>
      <Card.Description>
        <ContentFragment content={content} />
      </Card.Description>
    </Card.Content>
  </Card>
)

TestCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default translate()(TestCard)
