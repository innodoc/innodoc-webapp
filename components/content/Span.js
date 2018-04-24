import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'

const IndexSpan = ({indexConcept, content}) => (
  <span className="index-concept" data-index-concept={indexConcept}>
    <ContentFragment content={content} />
  </span>
)
IndexSpan.propTypes = {
  indexConcept: PropTypes.string.isRequired,
  content: PropTypes.array.isRequired
}

const HintText = ({content}) => (
  <span className="hint-text">
    <ContentFragment content={content} />
  </span>
)
HintText.propTypes = {
  content: PropTypes.array.isRequired
}

export default class Span extends BaseContentComponent {

  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const [, classNames, attributes] = this.props.data[0]
    const content = this.props.data[1]

    if (content === [])
      return <span style={{backgroundColor: 'red'}}>Empty span here!</span>

    if (attributes.length === 1 && attributes[0][0] === 'data-index-concept') {
      const concept = attributes[0][1]
      return <IndexSpan indexConcept={concept} content={content} />
    }

    if (classNames.includes('hint-text')) {
      return <HintText classNames="hint-text" content={content} />
    }

    return (
      <span>
        <span style={{backgroundColor: 'red'}}>
          Strange span here!
        </span>
        <ContentFragment content={content} />
      </span>
    )
  }

}
