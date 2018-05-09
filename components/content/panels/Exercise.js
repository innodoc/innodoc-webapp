import React from 'react';
import {Card, Button} from 'semantic-ui-react'

import BaseContentComponent from '../Base'
import ContentFragment from '../../ContentFragment'

class Exercise extends BaseContentComponent {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Card color='blue' fluid className='exercise'>
        {/* TODO i18n */}
        <Card.Content header='Exercise' />
        <Card.Content>
          <ContentFragment content={this.props.content} />
        </Card.Content>
      </Card>
    )
  }
}

class ExerciseHint extends BaseContentComponent {
  constructor(props) {
    super(props);

    this.state = {
      visible: false
    }
  }

  toggleVisibility = () => this.setState({ visible: !this.state.visible })

  render() {
    if (this.state.visible) {
      return (
        <div>
          <Button content="Lösung verstecken" onClick={this.toggleVisibility} />
          <ContentFragment content={this.props.content} />
        </div>
      )
    } else {
      return (
        <div>
          {/* TODO i18n */}
          <Button content="Lösung" onClick={this.toggleVisibility} />
        </div>
      )
    }
  }
}

export {
  Exercise,
  ExerciseHint
}
