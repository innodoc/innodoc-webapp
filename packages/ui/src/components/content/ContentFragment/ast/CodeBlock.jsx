import PropTypes from 'prop-types'

import css from './ast.module.sss'

function CodeBlock({ data }) {
  const [[id, codeType], content] = data
  return (
    <pre className={css.codeblock}>
      <code className={`code-${codeType}`} id={id}>
        {content}
      </code>
    </pre>
  )
}

CodeBlock.propTypes = {
  data: PropTypes.arrayOf(PropTypes.any).isRequired,
}

export default CodeBlock
