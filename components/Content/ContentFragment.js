import React from 'react'

import { contentType } from '../../lib/propTypes'
import UnknownType from './content/UnknownType'
import Str from './content/Str'
// TODO: fix dependency cycles
// https://stackoverflow.com/questions/35559631/how-to-handle-react-nested-component-circular-dependency-using-es6-classes#35560750
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
import Link from './content/Link'
import Table from './content/Table'
import Plain from './content/Plain'

const Space = () => ' '
const LineBreak = () => <br />

// Marks soft breaks between sentences. <wbr> or &shy; wouldn't make sense here.
const SoftBreak = () => ' '

const contentTypeComponentMap = {
  Header,
  Str,
  Space,
  SoftBreak,
  LineBreak,
  Para,
  Div,
  Span,
  Emph,
  Strong,
  Code,
  BulletList,
  OrderedList,
  Math,
  Link,
  Table,
  Plain,
}

const mapContentTypeToComponent = (name) => {
  const Component = contentTypeComponentMap[name]
  return Component || UnknownType
}

export default class ContentFragment extends React.Component {
  static propTypes = {
    content: contentType.isRequired,
  }

  render() {
    const { content } = this.props
    const output = []
    for (let i = 0; i < content.length; i += 1) {
      const el = content[i]
      const Component = mapContentTypeToComponent(el.t)
      output.push(<Component key={i.toString()} name={el.t} data={el.c} />)
    }
    return output
  }
}
