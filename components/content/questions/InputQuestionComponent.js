import React from 'react'
import classNames from 'classnames'
import { Input, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'

import css from './style.sass'
import QuestionComponent from './QuestionComponent'
import { exerciseInputAsync } from '../../../store/actions/exercises'

class InputQuestionComponent extends QuestionComponent {
  getIcon() {
    if (this.props.inputValue === '') {
      return <Icon name="question" />
    }
    if (this.props.solved) {
      return <Icon name="check" color="green" />
    }
    return <Icon name="close" color="red" />
  }

  render() {
    const inputClass = classNames('exercise', css.inputquestion, {
      [css.solved]: this.props.solved,
      [css.wrong]: this.props.inputValue !== '' && !this.props.solved,
    })

    return (
      <Input
        type="text"
        className={inputClass}
        value={this.props.inputValue}
        icon={this.getIcon()}
        onChange={this.handleChange}
      />
    )
  }
}

const getInputValueFromState = (state, uuid) => {
  if (state.exercises[uuid] !== undefined) {
    return state.exercises[uuid].inputValue
  }
  return ''
}

const getSolvedFromState = (state, uuid) => {
  if (state.exercises[uuid] !== undefined) {
    return state.exercises[uuid].solved
  }
  return false
}

const mapStateToProps = (state, ownProps) => ({
  inputValue: getInputValueFromState(state, ownProps.uuid),
  solved: getSolvedFromState(state, ownProps.uuid),
})

const mapDispatchToProps = dispatch => ({
  onInputChanged: (data) => {
    dispatch(exerciseInputAsync(data))
  },
})

const InputQuestion = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputQuestionComponent)

export default InputQuestion
