import React from 'react'
import PropTypes from 'prop-types'

class QuestionComponent extends React.Component {
  constructor(props) {
    super(props)
    this.handleChange = this.handleChange.bind(this)
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
}

QuestionComponent.propTypes = {
  uuid: PropTypes.string.isRequired,
  solution: PropTypes.string.isRequired,
  validator: PropTypes.func.isRequired,
  solved: PropTypes.bool.isRequired,
  onInputChanged: PropTypes.shape({
    uuid: PropTypes.string.isRequired,
    inputValue: PropTypes.string.isRequired,
    solved: PropTypes.bool.isRequired,
    solution: PropTypes.string.isRequired,
    validator: PropTypes.func.isRequired,
  }).isRequired,
}

export default QuestionComponent
