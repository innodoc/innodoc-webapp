import React from 'react'
import PropTypes from 'prop-types'

import Sidebar from './Sidebar'
import Header from './Header'

export default class Layout extends React.Component {

  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired
  }

  render() {

    const navTree = [
      {
        id: 'vbkm01',
        title: 'Kapitel 1',
      },
      {
        id: 'exercises',
        title: 'Exercises',
      },
      {
        id: 'vbkm01_exercises',
        title: 'vbkm01_exercises',
      },
      {
        id: 'test',
        title: 'Test',
      },
    ]

    return (
      <div>
        <Sidebar navTree={navTree}>
          <div className="container">
            <Header />
            {this.props.children}
          </div>
        </Sidebar>
      </div>
    )
  }

}
