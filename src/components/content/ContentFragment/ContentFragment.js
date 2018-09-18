/* ContentFragment is used recursively in a number of sub-components. This leads
 * to dependency cycles. This is why eslint rule 'import/no-cycle' was disabled
 * for the entire module in .eslintrc.json.
 */

import React from 'react'

import { contentType } from '../../../lib/propTypes'
import {
  UnknownType,
  Space,
  SoftBreak,
  LineBreak,
  Str,
  Header,
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
} from './astComponents'

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

// ContentFragment parses Pandoc-like AST document stuctures by mapping
// AST element types to Component implementations.
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
