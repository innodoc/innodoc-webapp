import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import BaseContentComponent from './Base'
import ContentFragment from '../ContentFragment'
import Exercise from './panels/Exercise'
import ExerciseHint from './panels/ExerciseHint'

export default class Div extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const [id, classes] = this.props.data[0]
    const content = this.props.data[1]

    if (classes.includes('exercise')) {
      return (
        <Exercise id={id} content={content} />
      )
    } else if (classes.includes('hint')) {
      return (
        <ExerciseHint id={id} content={content} />
      )
    }

    return (
      <div id={id} className={classNames(classes.concat(['panel']))}>
        <ContentFragment content={content} />
      </div>
    )
  }
}
