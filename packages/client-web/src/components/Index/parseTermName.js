import React from 'react'
import MathJax from '@innodoc/react-mathjax-node'

const ESCAPED_DOLLARSIGN = '__ESCAPED_DOLLARSIGN__'

const parseTermName = (term) => {
  const name = []
  let index = 0
  let remain = term.replace(/\\\$/g, ESCAPED_DOLLARSIGN)
  while (remain.length > 0) {
    let match = remain.match(/^([^$]+)/)
    if (match) {
      // string token
      const [, content] = match
      name.push(
        <span key={index}>{content.replace(new RegExp(ESCAPED_DOLLARSIGN, 'g'), '$')}</span>
      )
      remain = remain.slice(content.length)
      index += 1
    } else {
      match = remain.match(/^\$([^$]*)\$/)
      if (match) {
        // Math token
        const [, content] = match
        name.push(<MathJax.MathJaxNode displayType="inline" key={index} texCode={content} />)
        remain = remain.slice(content.length + 2)
        index += 1
      } else {
        throw new Error(`Could not parse index term: ${term}`)
      }
    }
  }
  return name
}

export default parseTermName
