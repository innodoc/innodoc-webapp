import React from 'react'
import PropTypes from 'prop-types'

const UnknownTypeData = ({ data }) => {
  const style = {
    margin: '0',
    padding: '0.1rem'
  }
  return <pre style={style}>{JSON.stringify(data, null, 2)}</pre>
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
    const divStyle = {
      backgroundColor: '#ff000033'
    }
    const spanStyle = {
      float: 'left'
    }
    const toggleData = () => {
      this.setState(prevState => ({ showData: !prevState.showData }))
    }

    let collapseIndicator = null
    let data = null
    if (this.props.data) {
      collapseIndicator = (
        <span style={spanStyle}>
          { this.state.showData ? '➖' : '➕'}
        </span>
      )
      if (this.state.showData) {
        data = <UnknownTypeData data={this.props.data} />
      }

    }

    return (
      <div className="unknown-component" style={divStyle} onClick={toggleData}>
        {collapseIndicator}
        <p>
          Unknown component: <strong><code>{this.props.name}</code></strong>
        </p>
        {data}
      </div>
    )
  }
}
