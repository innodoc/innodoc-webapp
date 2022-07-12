import React from 'react'

import { propTypes } from '@innodoc/client-misc'

import ContentFragment from '..'

const Emph = ({ data }) => (
  <em>
    <ContentFragment content={data} />
  </em>
)

Emph.propTypes = { data: propTypes.contentType.isRequired }

export default Emph
