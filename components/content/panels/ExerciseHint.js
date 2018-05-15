import React from 'react'
import {Button, Divider, Message} from 'semantic-ui-react'
import {translate} from 'react-i18next'

import BaseContentComponent from '../Base'
import ContentFragment from '../../ContentFragment'

class ExerciseHint extends BaseContentComponent {
  constructor(props) {
    super(props)

    this.state = {
      visible: false,
    }
  }

  handleToggle = () => this.setState({ visible: !this.state.visible })

  render() {
    const {t} = this.props
    const {visible} = this.state
    const button = !visible
      ? <Button content={t('content.solution')}
                onClick={this.handleToggle}
                color='blue'
        /> : null
    const content = <ContentFragment content={this.props.content} />

    return (
      <React.Fragment>
        <Divider />
        {button}
        <Message hidden={!visible}
                 color='blue'
                 icon='lightbulb'
                 header={t('content.solution')}
                 onDismiss={this.handleToggle}
                 content={content}
        />
      </React.Fragment>
    )
  }
}

export default translate()(ExerciseHint)
