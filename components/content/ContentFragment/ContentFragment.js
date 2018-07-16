/* ContentFragment is used recursively in a number of sub-components. This leads
 * to dependency cycles. This is why eslint rule 'import/no-cycle' was disabled
 * for the entire module in .eslintrc.json.
 */

import React from 'react'

import { contentType } from '../../../lib/propTypes'
import UnknownType from './UnknownType'
import Str from './Str'
import Header from './Header'
import Para from './Para'
import Div from './Div'
import Span from './Span'
import Emph from './Emph'
import Strong from './Strong'
import Code from './Code'
import BulletList from './BulletList'
import OrderedList from './OrderedList'
import Math from './Math'
import Link from './Link'
import Table from './Table'
import Plain from './Plain'

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
