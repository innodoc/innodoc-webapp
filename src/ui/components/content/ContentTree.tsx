import type { AnyElt, Tree } from 'pandoc-filter'

import InlineError from '@/ui/components/common/InlineError'

import BlockQuote from './elt/block/BlockQuote'
import BulletList from './elt/block/BulletList'
import CodeBlock from './elt/block/CodeBlock'
import DefinitionList from './elt/block/DefinitionList'
import Div from './elt/block/Div'
import Header from './elt/block/Header'
import HorizontalRule from './elt/block/HorizontalRule'
import LineBlock from './elt/block/LineBlock'
import Null from './elt/block/Null'
import OrderedList from './elt/block/OrderedList'
import Para from './elt/block/Para'
import RawBlock from './elt/block/RawBlock'
import Table from './elt/block/Table'
import Cite from './elt/inline/Cite'
import Code from './elt/inline/Code'
import Emph from './elt/inline/Emph'
import Image from './elt/inline/Image'
import LineBreak from './elt/inline/LineBreak'
import Link from './elt/inline/Link'
import Note from './elt/inline/Note'
import Plain from './elt/inline/Plain'
import Quoted from './elt/inline/Quoted'
import RawInline from './elt/inline/RawInline'
import SmallCaps from './elt/inline/SmallCaps'
import SoftBreak from './elt/inline/SoftBreak'
import Space from './elt/inline/Space'
import Span from './elt/inline/Span'
import Str from './elt/inline/Str'
import Strikeout from './elt/inline/Strikeout'
import Strong from './elt/inline/Strong'
import Subscript from './elt/inline/Subscript'
import Superscript from './elt/inline/Superscript'
import Math from './elt/Math'

function Elt({ elt }: EltRendererProps) {
  if (elt.t === 'Math') return <Math content={elt.c} />
  // Block
  if (elt.t === 'BlockQuote') return <BlockQuote content={elt.c} />
  if (elt.t === 'BulletList') return <BulletList content={elt.c} />
  if (elt.t === 'CodeBlock') return <CodeBlock content={elt.c} />
  if (elt.t === 'DefinitionList') return <DefinitionList content={elt.c} />
  if (elt.t === 'Div') return <Div content={elt.c} />
  if (elt.t === 'Header') return <Header content={elt.c} />
  if (elt.t === 'HorizontalRule') return <HorizontalRule content={elt.c} />
  if (elt.t === 'LineBlock') return <LineBlock content={elt.c} />
  if (elt.t === 'Null') return <Null content={elt.c} />
  if (elt.t === 'OrderedList') return <OrderedList content={elt.c} />
  if (elt.t === 'Para') return <Para content={elt.c} />
  if (elt.t === 'RawBlock') return <RawBlock content={elt.c} />
  if (elt.t === 'Table') return <Table content={elt.c} />
  // Inline
  if (elt.t === 'Cite') return <Cite content={elt.c} />
  if (elt.t === 'Code') return <Code content={elt.c} />
  if (elt.t === 'Emph') return <Emph content={elt.c} />
  if (elt.t === 'Image') return <Image content={elt.c} />
  if (elt.t === 'LineBreak') return <LineBreak content={elt.c} />
  if (elt.t === 'Link') return <Link content={elt.c} />
  if (elt.t === 'Note') return <Note content={elt.c} />
  if (elt.t === 'Plain') return <Plain content={elt.c} />
  if (elt.t === 'Quoted') return <Quoted content={elt.c} />
  if (elt.t === 'RawInline') return <RawInline content={elt.c} />
  if (elt.t === 'SmallCaps') return <SmallCaps content={elt.c} />
  if (elt.t === 'SoftBreak') return <SoftBreak content={elt.c} />
  if (elt.t === 'Space') return <Space content={elt.c} />
  if (elt.t === 'Span') return <Span content={elt.c} />
  if (elt.t === 'Str') return <Str content={elt.c} />
  if (elt.t === 'Strikeout') return <Strikeout content={elt.c} />
  if (elt.t === 'Strong') return <Strong content={elt.c} />
  if (elt.t === 'Subscript') return <Subscript content={elt.c} />
  if (elt.t === 'Superscript') return <Superscript content={elt.c} />

  return <InlineError>ContentTree: Invalid element encountered!</InlineError>
}

type EltRendererProps = {
  elt: AnyElt
}

// Parse Pandoc AST by mapping element types to Component implementations
function ContentTree({ content: tree }: ContentTreeProps) {
  return (
    <>
      {tree.map((elt, idx) => (
        <Elt key={idx} elt={elt} />
      ))}
    </>
  )
}

type ContentTreeProps = {
  content: Tree
}

export default ContentTree
