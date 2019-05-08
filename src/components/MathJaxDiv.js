import React from 'react'
import PropTypes from 'prop-types'

import withMathJax from './hoc/withMathJax'

const mathInlineOpen = '\\('
const mathInlineClose = '\\)'

class MathJaxDiv extends React.Component {
  static propTypes = {
    userInput: PropTypes.string,
    mathJaxContentRef: PropTypes.objectOf(PropTypes.any).isRequired,
    typesetMathJax: PropTypes.func.isRequired,
  }

  static defaultProps = {
    userInput: '',
  }

  componentDidMount() {
    this.initialTypeset()
  }

  componentDidUpdate(prevProps) {
    const { mathJaxContentRef, userInput } = this.props
    if (userInput !== prevProps.userInput) {
      const elementJax = window.MathJax.Hub.getAllJax(mathJaxContentRef.current)[0]
      if (elementJax) {
        window.MathJax.Hub.Queue(['Text', elementJax, userInput, (a,b,c) => {
          console.log('Text, rerender DONE! Error=', elementJax.texError)
        }])
      } else {
        this.initialTypeset()
      }
    }
  }

  componentWillUnmount() {
    const { mathJaxContentRef } = this.props
    const elementJax = window.MathJax.Hub.getAllJax(mathJaxContentRef.current)[0]
    if (elementJax) {
      window.MathJax.Hub.Queue(['Remove', elementJax])
    }
  }

  initialTypeset() {
    const { mathJaxContentRef, typesetMathJax, userInput } = this.props
    const contentEl = mathJaxContentRef.current
    contentEl.innerHTML = userInput && userInput.length
      ? `${mathInlineOpen}${userInput}${mathInlineClose}`
      : ''
    typesetMathJax()
  }

  render() {
    const { mathJaxContentRef } = this.props
    return (
      <div ref={mathJaxContentRef} />
    )
  }
}

export default withMathJax(MathJaxDiv)
