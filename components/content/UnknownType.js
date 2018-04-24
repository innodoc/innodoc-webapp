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
  data: PropTypes.array.isRequired
}

export default class UnknownType extends React.Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    data: PropTypes.array.isRequired
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

    return (
      <div className="unknown-component" style={divStyle} onClick={toggleData}>
        <span style={spanStyle}>
          { this.state.showData ? '➖' : '➕'}
        </span>
        <p>
          Unkown component: <strong><code>{this.props.name}</code></strong>
        </p>
        { this.state.showData ? <UnknownTypeData data={this.props.data} /> : null }
      </div>
    )
  }
}
