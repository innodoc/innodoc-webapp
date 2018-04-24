import React from 'react'
import PropTypes from 'prop-types'

import Str from './content/Str'
import Header from './content/Header'
import UnknownType from './content/UnknownType'

const contentTypeComponentMap = {
  'Header': Header,
  'Str': Str,
  'Space': () => ' '
}

const mapContentTypeToComponent = (name) => {
  const Component = contentTypeComponentMap[name]
  if (!Component)
    return UnknownType
  return Component
}

export default class ContentFragment extends React.Component {

  static propTypes = {
    content: PropTypes.array.isRequired
  }

  render() {
    const output = []
    for (let i = 0; i < this.props.content.length; i++) {
      const el = this.props.content[i]
      const Component = mapContentTypeToComponent(el.t)
      output.push(<Component key={i.toString()} name={el.t} data={el.c} />)
    }
    return output
  }

}
