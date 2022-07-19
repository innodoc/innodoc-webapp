import PropTypes from 'prop-types'
import { EllipsisOutlined } from '@ant-design/icons'

import MathJax from '@innodoc/react-mathjax-node'

const MathJaxPreview = ({ texCode }) => {
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
