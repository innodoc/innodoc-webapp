import React from 'react'

import { contentType } from '@innodoc/client-misc/src/propTypes'

import ContentFragment from '..'

const Para = ({ data }) => (
  <p>
    <ContentFragment content={data} />
  </p>
)
Para.propTypes = { data: contentType.isRequired }

export default Para