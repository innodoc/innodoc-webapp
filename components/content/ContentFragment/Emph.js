import React from 'react'

import { contentType } from '../../../lib/propTypes'
import ContentFragment from '.'

const Emph = ({ data }) => (
  <em>
    <ContentFragment content={data} />
  </em>
)

Emph.propTypes = { data: contentType.isRequired }

export default Emph
