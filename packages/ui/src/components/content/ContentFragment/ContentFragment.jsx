/* ContentFragment is used recursively in a number of sub-components. This leads
 * to dependency cycles. This is why eslint rule 'import/no-cycle' was disabled
 * for the entire module in .eslintrc.json.
 */

import { contentType } from '@innodoc/misc/propTypes'

import BlockQuote from './ast/BlockQuote.jsx'
import BulletList from './ast/BulletList.jsx'
import Code from './ast/Code.jsx'
import CodeBlock from './ast/CodeBlock.jsx'
import DefinitionList from './ast/DefinitionList.jsx'
import Div from './ast/Div.jsx'
import Emph from './ast/Emph.jsx'
import Header from './ast/Header.jsx'
import HorizontalRule from './ast/HorizontalRule.jsx'
import Image from './ast/Image.jsx'
import Link from './ast/Link.jsx'
import Math from './ast/Math.jsx'
import OrderedList from './ast/OrderedList.jsx'
import Para from './ast/Para.jsx'
import Plain from './ast/Plain.jsx'
import Quoted from './ast/Quoted.jsx'
import Span from './ast/Span.jsx'
import Str from './ast/Str.jsx'
import Strikeout from './ast/Strikeout.jsx'
import Strong from './ast/Strong.jsx'
import Table from './ast/Table.jsx'
import UnknownType from './ast/UnknownType.jsx'
import { Space, LineBreak, SoftBreak } from './ast/whitespace.jsx'

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
ContentFragment.propTypes = { content: contentType.isRequired }

export default ContentFragment
