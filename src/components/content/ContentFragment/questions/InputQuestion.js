import React from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'

import { Input, Icon } from 'semantic-ui-react'
import { connect } from 'react-redux'

import { exValidatorArgType } from '../../../../lib/propTypes'
import { exerciseCompleted } from '../../../../store/actions/exercise'
import exerciseSelectors from '../../../../store/selectors/exercise'
import css from './style.sass'

class InputQuestion extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
  }

  getIcon() {
    const { inputValue, solved } = this.props
    if (inputValue === '') {
      return <Icon name="question" />
    }
    if (solved) {
      return <Icon name="check" color="green" />
    }
    return <Icon name="close" color="red" />
  }

  handleChange(event) {
    const {
      onInputChanged,
      id,
      solved,
      solution,
      attrs,
    } = this.props
    onInputChanged({
      id,
      solved,
      solution,
      attrs,
      inputValue: event.target.value,
    })
  }

  render() {
    const { inputValue, solved } = this.props

    const inputClass = classNames('exercise', css.inputquestion, {
      [css.solved]: solved,
      [css.wrong]: inputValue !== '' && !solved,
    })

    return (
      <Input
        type="text"
        className={inputClass}
        value={inputValue}
        icon={this.getIcon()}
        onChange={this.handleChange}
      />
    )
  }
}

InputQuestion.propTypes = {
  attrs: exValidatorArgType.isRequired,
  id: PropTypes.string.isRequired,
  inputValue: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
  solved: PropTypes.bool.isRequired,
  onInputChanged: PropTypes.func.isRequired,
}

const mapStateToProps = (state, ownProps) => ({
  inputValue: exerciseSelectors.getQuestionInputValue(state, ownProps.id),
  solved: exerciseSelectors.getQuestionState(state, ownProps.id),
})

const mapDispatchToProps = {
  onInputChanged: exerciseCompleted,
}

export default connect(mapStateToProps, mapDispatchToProps)(InputQuestion)
