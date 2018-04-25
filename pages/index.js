import React from 'react'
import PropTypes from 'prop-types'
import Link from 'next/link'
import Layout from '../components/Layout.js'

class PostLink extends React.Component {

  static propTypes = {
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  render() {
    return (
      <li>
        <Link as={`/page/${this.props.id}`}
              href={`/post?title=${this.props.title}`}>
          <a>{this.props.title}</a>
        </Link>
      </li>
    )
  }

}

const Index = () => (
  <Layout>
    <h1>innoDoc</h1>
    <ul>
      <PostLink id="kap-1" title="Kapitel 1"/>
    </ul>
  </Layout>
)

export default Index
