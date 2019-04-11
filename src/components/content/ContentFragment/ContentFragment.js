/* ContentFragment is used recursively in a number of sub-components. This leads
 * to dependency cycles. This is why eslint rule 'import/no-cycle' was disabled
 * for the entire module in .eslintrc.json.
 */

import React from 'react'

import { contentType } from '../../../lib/propTypes'
import {
  BulletList,
  Code,
  CodeBlock,
  Div,
  Emph,
  Header,
  Image,
  LineBreak,
  Link,
  Math,
  OrderedList,
  Para,
  Plain,
  Quoted,
  SoftBreak,
  Space,
  Span,
  Str,
  Strong,
  Table,
  UnknownType,
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
  CodeBlock,
  BulletList,
  OrderedList,
  Math,
  Link,
  Table,
  Plain,
  Quoted,
  Image,
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
