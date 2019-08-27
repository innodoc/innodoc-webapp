import React from 'react'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sass'
import ContentFragment from '..'

const BlockQuote = ({ data }) => (
  <blockquote className={css.blockquote}>
    <ContentFragment content={data} />
  </blockquote>
)

BlockQuote.propTypes = { data: contentType.isRequired }

export default BlockQuote
