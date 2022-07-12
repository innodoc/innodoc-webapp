/* ContentFragment is used recursively in a number of sub-components. This leads
 * to dependency cycles. This is why eslint rule 'import/no-cycle' was disabled
 * for the entire module in .eslintrc.json.
 */

import React from 'react'

import { propTypes } from '@innodoc/client-misc'
import {
  BlockQuote,
  BulletList,
  Code,
  CodeBlock,
  DefinitionList,
  Div,
  Emph,
  Header,
  HorizontalRule,
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
  Strikeout,
  Strong,
  Table,
  UnknownType,
} from './astComponents'

const contentTypeComponentMap = {
  BlockQuote,
  BulletList,
  Code,
  CodeBlock,
  DefinitionList,
  Div,
  Emph,
  Header,
  HorizontalRule,
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
  Strikeout,
  Strong,
  Table,
}

const mapContentTypeToComponent = (name) => {
  const Component = contentTypeComponentMap[name]
  return Component || UnknownType
}

// ContentFragment parses Pandoc-like AST document stuctures by mapping
// AST element types to Component implementations.
const ContentFragment = ({ content }) => {
  const output = []
  for (let i = 0; i < content.length; i += 1) {
    const el = content[i]
    const Component = mapContentTypeToComponent(el.t)
    output.push(<Component key={i.toString()} name={el.t} data={el.c} />)
  }
  return output
}
ContentFragment.propTypes = { content: propTypes.contentType.isRequired }

export default ContentFragment
