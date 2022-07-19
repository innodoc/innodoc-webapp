import { propTypes } from '@innodoc/misc'

import ContentFragment from '..'

const Plain = ({ data }) => <ContentFragment content={data} />

Plain.propTypes = { data: propTypes.contentType.isRequired }

export default Plain
