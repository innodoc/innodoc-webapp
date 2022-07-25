import { contentType } from '@innodoc/misc/propTypes'

import ContentFragment from '../ContentFragment.jsx'

function Emph({ data }) {
  return (
    <em>
      <ContentFragment content={data} />
    </em>
  )
}

Emph.propTypes = { data: contentType.isRequired }

export default Emph
