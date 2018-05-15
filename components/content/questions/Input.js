import React from 'react';
import PropTypes from 'prop-types'
import math from 'mathjs'
import classNames from 'classnames'
import {Input, Icon} from 'semantic-ui-react'

import BaseContentComponent from '../Base'
import css from './style.sass'

class QuestionComponent extends BaseContentComponent{
  constructor(props) {
    super(props);

    this.state = {
      points: 0,
      inputValue: '',
      solved: false,
      color: 'transparent'
    }
    this.handleChange = this.handleChange.bind(this)
  }

  update() {
    let solved = this.validate()

    this.setState({
      solved: solved
    })
  }

  handleChange(event) {
    this.setState({inputValue: event.target.value}, () => {
      this.update()
    });
  }
}

class InputQuestionComponent extends QuestionComponent {
  static propTypes = {
    solution: PropTypes.string.isRequired,
  }

  validate() {
    const solved = this.state.inputValue == this.props.solution
    return solved
  }

  getIcon() {
    if (this.state.inputValue == '') {
      return <Icon name='question' />
    } else {
      if (this.state.solved) {
        return <Icon name='check' color='green'/>
      } else {
        return <Icon name='close' color='red' />
      }
    }

  }

  render() {
    const inputClass = classNames('exercise', css.inputquestion, {
      [css.solved]: this.state.solved,
      [css.wrong]: this.state.inputValue !== '' && !this.state.solved
    })

    return (
      <Input
        type='text'
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
    //TODO is this mathematecally correct (creates the same wrongs and corrects
    //as before?)
    var epsilon = this.props.attrs.precision
    epsilon = math.eval('1e-' + epsilon)
    math.config({
      epsilon: epsilon
    })

    try{
      var evalInput = math.eval(this.state.inputValue)
      var evalSolution = math.eval(this.props.solution)
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
      try {
        var parsedInput = math.simplify(math.parse(this.state.inputValue))
        var parsedSolution = math.simplify(math.parse(this.props.solution))
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
  FunctionInputQuestionComponent
}
