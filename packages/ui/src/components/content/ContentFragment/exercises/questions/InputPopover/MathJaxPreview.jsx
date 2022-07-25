import { EllipsisOutlined } from '@ant-design/icons'
import PropTypes from 'prop-types'

import MathJax from '@innodoc/react-mathjax-node'

function MathJaxPreview({ texCode }) {
  const icon = texCode.length ? null : <EllipsisOutlined />
  const mjNode = texCode.length ? (
    <MathJax.MathJaxNode displayType="display" texCode={texCode} />
  ) : null

  return (
    <MathJax.Provider>
      {icon}
      {mjNode}
    </MathJax.Provider>
  )
}

MathJaxPreview.propTypes = {
  texCode: PropTypes.string.isRequired,
}

export default MathJaxPreview
