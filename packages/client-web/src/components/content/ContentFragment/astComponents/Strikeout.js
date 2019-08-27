import React from 'react'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '..'

const Strikeout = ({ data }) => (
  <s>
    <ContentFragment content={data} />
  </s>
)

Strikeout.propTypes = { data: contentType.isRequired }

export default Strikeout
