import React from 'react'
import PropTypes from 'prop-types'
import {Container} from 'semantic-ui-react'

import css from './style.sass'
import Header from './Header'

export default class Layout extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  }

  render() {
    // const navTree = [
    //   {
    //     pageSlug: 'vbkm01',
    //     title: 'Kapitel 1',
    //   },
    //   {
    //     pageSlug: 'exercises',
    //     title: 'Exercises',
    //   },
    //   {
    //     pageSlug: 'vbkm01_exercises',
    //     title: 'vbkm01_exercises',
    //   },
    //   {
    //     pageSlug: 'test',
    //     title: 'Test',
    //   },
    // ]

    return (
      <div>
        <Header />
        <Container text className={css.courseContent}>
          {this.props.children}
        </Container>
      </div>
    )
  }
}
