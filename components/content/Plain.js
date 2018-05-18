import React from 'react'

import { contentType } from '../../lib/propTypes'
import ContentFragment from '../ContentFragment'

const Plain = ({ data }) => (
  <ContentFragment content={data} />
)

Plain.propTypes = { data: contentType.isRequired }

export default Plain
