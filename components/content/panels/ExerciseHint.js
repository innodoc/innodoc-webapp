import React from 'react'
import PropTypes from 'prop-types'
import { Button, Divider, Message } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../lib/propTypes'
import ContentFragment from '../../ContentFragment'

class ExerciseHint extends React.Component {
  static propTypes = {
    content: contentType.isRequired,
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props)
    this.state = { visible: false }
  }

  handleToggle = () => this.setState({ visible: !this.state.visible })

  render() {
    const { content, t } = this.props
    const { visible } = this.state
    const button = !visible
      ? (
        <Button
          content={t('content.solution')}
          onClick={this.handleToggle}
          color="blue"
        />
      ) : null
    const contentFragment = <ContentFragment content={content} />

    return (
      <React.Fragment>
        <Divider />
        {button}
        <Message
          hidden={!visible}
          color="blue"
          icon="lightbulb"
          header={t('content.solution')}
          onDismiss={this.handleToggle}
          content={contentFragment}
        />
      </React.Fragment>
    )
  }
}

export default translate()(ExerciseHint)
