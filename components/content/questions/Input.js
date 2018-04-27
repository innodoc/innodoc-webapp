import React from 'react';
import PropTypes from 'prop-types'
var math = require('mathjs');

import BaseContentComponent from '../Base'


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

    // debugging color
    let color
    if (this.state.inputValue == '') {
      color = 'transparent'
    } else if (solved) {
      color = 'green'
    } else {
      color = 'red'
    }

    this.setState({
      color: color,
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

  render() {
    return (
      <input
        type='text'
        className='exercise inputquestion'
        value={this.state.inputValue}
        onChange={this.handleChange}
        style={{ backgroundColor: this.state.color}}/>
    )
  }
}

class MathInputQuestionComponent extends InputQuestionComponent {
  validate() {

    var epsilon = this.props.attrs.precision
    epsilon = math.eval('1e-' + epsilon)
    math = math.create({
      epsilon: epsilon
    })

    try{
      var parsedInput = math.eval(this.state.inputValue)
      var parsedSolution = math.eval(this.props.solution)
    } catch (e) {
      if (e instanceof SyntaxError) {
        return false
      }
    }
    if (typeof parsedInput !== 'undefined') {
      return math.equal(parsedInput, parsedSolution)
    }
    return false
  }
}

// class FunctionInputQuestionComponent extends InputQuestionComponent {
//
// }

export {QuestionComponent, InputQuestionComponent, MathInputQuestionComponent}
