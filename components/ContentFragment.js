import React from 'react'
import PropTypes from 'prop-types'

import UnknownType from './content/UnknownType'
import Str from './content/Str'
import Header from './content/Header'
import Para from './content/Para'
import Div from './content/Div'
import Span from './content/Span'
import Emph from './content/Emph'
import Strong from './content/Strong'
import Code from './content/Code'
import BulletList from './content/BulletList'
import OrderedList from './content/OrderedList'
import Math from './content/Math'

const Space = () => ' '
const LineBreak = () => <br />

// Marks soft breaks between sentences. <wbr> or &shy; wouldn't make sense here.
const SoftBreak = () => ' '

const contentTypeComponentMap = {
  'Header': Header,
  'Str': Str,
  'Space': Space,
  'SoftBreak': SoftBreak,
  'LineBreak': LineBreak,
  'Para': Para,
  'Div': Div,
  'Span': Span,
  'Emph': Emph,
  'Strong': Strong,
  'Code': Code,
  'BulletList': BulletList,
  'OrderedList': OrderedList,
  'Math': Math
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
