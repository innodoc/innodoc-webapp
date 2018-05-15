import React from 'react'
import {Card} from 'semantic-ui-react'
import {translate} from 'react-i18next'

import BaseContentComponent from '../Base'
import ContentFragment from '../../ContentFragment'

class Exercise extends BaseContentComponent {
  constructor(props) {
    super(props)
  }

  render() {
    const {t} = this.props
    return (
      <Card color='blue' fluid>
        <Card.Content>
          <Card.Header>
            {t('content.exercise')}
          </Card.Header>
          <Card.Description>
            <ContentFragment content={this.props.content} />
          </Card.Description>
        </Card.Content>
      </Card>
    )
  }
}

export default translate()(Exercise)
