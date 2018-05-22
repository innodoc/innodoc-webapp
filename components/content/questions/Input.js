import React from 'react'
import PropTypes from 'prop-types'
import math from 'mathjs'
import classNames from 'classnames'
import { Input, Icon } from 'semantic-ui-react'

import css from './style.sass'

class QuestionComponent extends React.Component {
  constructor(props) {
    super(props)

    /* eslint-disable react/no-unused-state */
    this.state = {
      points: 0,
      inputValue: '',
      solved: false,
      color: 'transparent',
    }
    this.handleChange = this.handleChange.bind(this)
  }

  update() {
    const solved = this.validate()

    this.setState({
      solved,
    })
  }

  handleChange(event) {
    this.setState({ inputValue: event.target.value }, () => {
      this.update()
    })
  }
}

class InputQuestionComponent extends QuestionComponent {
  static propTypes = {
    solution: PropTypes.string.isRequired,
  }

  validate() {
    const solved = this.state.inputValue === this.props.solution
    return solved
  }

  getIcon() {
    if (this.state.inputValue === '') {
      return <Icon name="question" />
    }
    if (this.state.solved) {
      return <Icon name="check" color="green" />
    }
    return <Icon name="close" color="red" />
  }

  render() {
    const inputClass = classNames('exercise', css.inputquestion, {
      [css.solved]: this.state.solved,
      [css.wrong]: this.state.inputValue !== '' && !this.state.solved,
    })

    return (
      <Input
        type="text"
        className={inputClass}
        value={this.state.inputValue}
        icon={this.getIcon()}
        onChange={this.handleChange}
      />
    )
  }
}

class MathInputQuestionComponent extends InputQuestionComponent {
  validate() {
    // TODO is this mathematecally correct (creates the same wrongs and corrects
    // as before?)
    let epsilon = this.props.attrs.precision
    epsilon = math.eval(`1e-${epsilon}`)
    math.config({
      epsilon,
    })

    let evalInput
    let evalSolution
    try {
      evalInput = math.eval(this.state.inputValue)
      evalSolution = math.eval(this.props.solution)
    } catch (e) {
      if (e instanceof SyntaxError) {
        return false
      }
    }
    if (typeof evalInput !== 'undefined') {
      return math.equal(evalInput, evalSolution)
    }
    return false
  }
}

class FunctionInputQuestionComponent extends InputQuestionComponent {
  validate() {
    let parsedInput
    let parsedSolution
    try {
      parsedInput = math.simplify(math.parse(this.state.inputValue))
      parsedSolution = math.simplify(math.parse(this.props.solution))
    } catch (e) {
      if (e instanceof SyntaxError) {
        return false
      }
    }

    if (typeof parsedInput !== 'undefined') {
      return parsedInput.equals(parsedSolution)
    }

    return false
  }
}

export {
  QuestionComponent,
  InputQuestionComponent,
  MathInputQuestionComponent,
  FunctionInputQuestionComponent,
}
