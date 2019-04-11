import React from 'react'

import css from './style.sass'
import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const BlockQuote = ({ data }) => (
  <blockquote className={css.blockquote}>
    <ContentFragment content={data} />
  </blockquote>
)

BlockQuote.propTypes = { data: contentType.isRequired }

export default BlockQuote
