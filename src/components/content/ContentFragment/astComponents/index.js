import React from 'react'

const Space = () => ' '
const LineBreak = () => <br />
// Marks soft breaks between sentences. <wbr> or &shy; wouldn't make sense here.
const SoftBreak = () => ' '

export { Space, LineBreak, SoftBreak }
export { default as UnknownType } from './UnknownType'
export { default as Str } from './Str'
export { default as Header } from './Header'
export { default as Para } from './Para'
export { default as Div } from './Div'
export { default as Span } from './Span'
export { default as Emph } from './Emph'
export { default as Strong } from './Strong'
export { default as Code } from './Code'
export { default as BulletList } from './BulletList'
export { default as OrderedList } from './OrderedList'
export { default as Math } from './Math'
export { default as Link } from './Link'
export { default as Table } from './Table'
export { default as Plain } from './Plain'
