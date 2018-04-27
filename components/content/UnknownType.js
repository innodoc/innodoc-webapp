import React from 'react'
import PropTypes from 'prop-types'

import css from './debug-style.sass'

const UnknownTypeData = ({ data }) => {
  return <pre className={css.componentData}>{JSON.stringify(data, null, 2)}</pre>
}
UnknownTypeData.propTypes = {
  data: PropTypes.any
}

export default class UnknownType extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.any
  }

  constructor(props) {
    super(props)
    this.state = { showData: false }
  }

  render() {
    const toggleData = () => {
      this.setState(prevState => ({ showData: !prevState.showData }))
    }

    let collapseIndicator = null
    let data = null
    if (this.props.data) {
      collapseIndicator = (
        <span className={css.toggler}>
          { this.state.showData ? '➖' : '➕'}
        </span>
      )
      if (this.state.showData) {
        data = <UnknownTypeData data={this.props.data} />
      }

    }

    return (
      <div className={css.unknownComponent} onClick={toggleData}>
        {collapseIndicator}
        <p>
          Unknown component: <strong><code>{this.props.name}</code></strong>
        </p>
        {data}
      </div>
    )
  }
}
