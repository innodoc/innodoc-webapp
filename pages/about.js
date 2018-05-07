import React from 'react'
import Layout from '../components/layout'

import {withReduxSaga} from '../store'

class AboutPage extends React.Component {
  render() {
    return <Layout>
      <p>This is the about page</p>
    </Layout>
  }
}

export default withReduxSaga()(AboutPage)
