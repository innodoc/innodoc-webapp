import { propTypes } from '@innodoc/misc'

import css from './ast.module.sss'
import ContentFragment from '..'

const BlockQuote = ({ data }) => (
  <blockquote className={css.blockquote}>
    <ContentFragment content={data} />
  </blockquote>
)

BlockQuote.propTypes = { data: propTypes.contentType.isRequired }

export default BlockQuote
