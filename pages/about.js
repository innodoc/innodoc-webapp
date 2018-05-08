import React from 'react'
import Layout from '../components/layout'
import {connect} from 'react-redux'

class AboutPage extends React.Component {
  render() {
    return <Layout>
      <p>This is the about page</p>
    </Layout>
  }
}

export default connect()(AboutPage)
