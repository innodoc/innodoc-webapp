import React from 'react'
import Layout from '../components/Layout.js'
import { Button } from 'reactstrap'

export default class AboutPage extends React.Component {
  render() {
    return <Layout>
      <Button color="danger">Danger!</Button>
      <p>This is the about page</p>
    </Layout>
  }
}
