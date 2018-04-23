import Link from 'next/link'
import Layout from '../components/Layout.js'

const PostLink = (props) => (
  <li>
    <Link as={`/page/${props.id}`} href={`/post?title=${props.title}`}>
      <a>{props.title}</a>
    </Link>
  </li>
)

const Index = () => (
  <Layout>
    <h1>innoConv</h1>
    <ul>
      <PostLink id="kap-1" title="Kapitel 1"/>
    </ul>
  </Layout>
)

export default Index
