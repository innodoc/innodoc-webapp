import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Input, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'

import css from './style.sass'
// import QuestionComponent from './QuestionComponent'
import { exerciseInputChanged } from '../../../store/actions/exercises'

class InputQuestionComponent extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  getIcon() {
    if (this.props.inputValue === '') {
      return <Icon name="question" />
    }
    if (this.props.solved) {
      return <Icon name="check" color="green" />
    }
    return <Icon name="close" color="red" />
  }

  handleChange(event) {
    this.props.onInputChanged({
      uuid: this.props.uuid,
      inputValue: event.target.value,
      solved: this.props.solved,
      solution: this.props.solution,
      validator: this.props.validator,
    })
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

InputQuestionComponent.propTypes = {
  uuid: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
  validator: PropTypes.func.isRequired,
  solved: PropTypes.bool.isRequired,
  onInputChanged: PropTypes.func.isRequired,
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
    dispatch(exerciseInputChanged(data))
  },
})

const InputQuestion = connect(
  mapStateToProps,
  mapDispatchToProps
)(InputQuestionComponent)

export default InputQuestion
