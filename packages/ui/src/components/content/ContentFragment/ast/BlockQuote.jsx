import { contentType } from '@innodoc/misc/propTypes'

import ContentFragment from '../ContentFragment.jsx'

import css from './ast.module.sss'

function BlockQuote({ data }) {
  return (
    <blockquote className={css.blockquote}>
      <ContentFragment content={data} />
    </blockquote>
  )
}

BlockQuote.propTypes = { data: contentType.isRequired }

export default BlockQuote
