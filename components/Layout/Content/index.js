import React from 'react'
import PropTypes from 'prop-types'
import {Container} from 'semantic-ui-react'

import css from './style.sass'

export default class Content extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
  }

  render() {
    return (
      <Container className={css.content}>
        {this.props.children}
      </Container>
    )
  }
}
