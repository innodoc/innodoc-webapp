import { contentType } from '@innodoc/misc/propTypes'

import ContentFragment from '../ContentFragment.jsx'

function Plain({ data }) {
  return <ContentFragment content={data} />
}

Plain.propTypes = { data: contentType.isRequired }

export default Plain
