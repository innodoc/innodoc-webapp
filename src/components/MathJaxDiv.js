import React from 'react'
import PropTypes from 'prop-types'

import fadeInCss from '../style/fadeIn.sass'
import withMathJax, { mathDelimiter, typesettingStates, typesettingStatusType } from './hoc/withMathJax'
import { refType } from '../lib/propTypes'

class MathJaxDiv extends React.Component {
  static propTypes = {
    mathJaxContentRef: refType.isRequired,
    typesettingStatus: typesettingStatusType.isRequired,
    updateMathJax: PropTypes.func.isRequired,
    userInput: PropTypes.string,
  }

  static defaultProps = {
    userInput: '',
  }

  componentDidMount() {
    // As this is using a third-party lib, DOM manipulation is not done by
    // React. We have an empty div that is pre-filled with content and later
    // managed by MathJax.
    const { mathJaxContentRef, userInput } = this.props
    const [delimOpen, delimClose] = mathDelimiter.inline
    mathJaxContentRef.current.innerHTML = `${delimOpen}${userInput || ''}${delimClose}`
  }

  componentDidUpdate(prevProps) {
    const { updateMathJax, userInput } = this.props
    if (userInput !== prevProps.userInput) {
      updateMathJax(0, userInput)
    }
  }

  render() {
    const { mathJaxContentRef, typesettingStatus } = this.props
    const className = typesettingStatus === typesettingStates.SUCCESS
      ? fadeInCss.show
      : fadeInCss.hide
    return <div className={className} ref={mathJaxContentRef} />
  }
}

export default withMathJax(MathJaxDiv)
