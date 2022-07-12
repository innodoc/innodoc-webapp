import React from 'react'

import { propTypes } from '@innodoc/client-misc'

import ContentFragment from '..'

const Plain = ({ data }) => <ContentFragment content={data} />

Plain.propTypes = { data: propTypes.contentType.isRequired }

export default Plain
