import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import loadScript from 'load-script'
import { Dimmer, Header, Loader, Image } from 'semantic-ui-react'

import ContentFragment from './ContentFragment'
import { selectors } from '../../store/reducers/content'
import { tocTreeType } from '../../lib/propTypes'
import Toc from '../Toc'
import css from './style.sass'

const Placeholder = () => (
  <React.Fragment>
    <Header as="h1">&nbsp;</Header>
    <p><Image src="/static/img/paragraph.png" /></p>
    <p><Image src="/static/img/paragraph.png" /></p>
  </React.Fragment>
)

class Content extends React.Component {
  static propTypes = {
    loading: PropTypes.bool.isRequired,
    content: PropTypes.arrayOf(PropTypes.object),
    title: PropTypes.arrayOf(PropTypes.object),
    sectionLevel: PropTypes.number.isRequired,
    subToc: tocTreeType,
  }

  static defaultProps = {
    title: [],
    content: [],
    subToc: [],
  }

  constructor(props) {
    super(props)
    this.mathJaxNode = React.createRef()
    this.state = {
      mathJaxLoaded: false,
    }
  }

  componentDidMount() {
    if (this.state.mathJaxLoaded) {
      this.typesetMathJax()
    } else {
      window.MathJax = {
        skipStartupTypeset: true,
        jax: ['input/TeX', 'output/CommonHTML'],
        tex2jax: {
          inlineMath: [['\\(', '\\)']],
          displayMath: [['\\[', '\\]']],
        },
        extensions: [
          'tex2jax.js',
          'MathEvents.js',
          'MathMenu.js',
          'TeX/noErrors.js',
          'TeX/noUndefined.js',
          'TeX/AMSmath.js',
          'TeX/AMSsymbols.js',
          '[a11y]/accessibility-menu.js',
          '[innodoc]/innodoc.mathjax.js',
        ],
        AuthorInit: () => {
          window.MathJax.Ajax.config.path.innodoc = `${window.location.origin}/static`
        },
      }
      loadScript('/static/vendor/MathJax/unpacked/MathJax.js', this.onLoadMathJax)
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.content !== this.props.content) { this.typesetMathJax() }
  }

  onLoadMathJax = (err) => {
    this.setState({ mathJaxLoaded: true })
    if (err) { throw new Error(err) }
    this.typesetMathJax()
  }

  typesetMathJax() {
    if (this.mathJaxNode) {
      window.MathJax.Hub.Queue([
        'Typeset',
        window.MathJax.Hub,
        this.mathJaxNode.current,
      ])
    }
  }

  render() {
    const {
      content: sectionContent,
      title,
      loading,
      sectionLevel,
      subToc,
    } = this.props

    const toc = subToc && sectionLevel < 3
      ? <Toc toc={subToc} />
      : null

    const content = loading
      ? <Placeholder />
      : (
        <React.Fragment>
          {toc}
          <Header as="h1">
            <ContentFragment content={title} />
          </Header>
          <div className={css.content} ref={this.mathJaxNode}>
            <ContentFragment content={sectionContent} />
          </div>
        </React.Fragment>
      )

    return (
      <Dimmer.Dimmable dimmed={loading}>
        <Dimmer active={loading} inverted>
          <Loader active={loading} size="big" />
        </Dimmer>
        {content}
      </Dimmer.Dimmable>
    )
  }
}

const mapStateToProps = (state) => {
  const loading = selectors.getContentLoading(state)
  const id = selectors.getCurrentSectionId(state)
  if (id) {
    const { title } = selectors.getSectionMeta(state, id)
    const content = selectors.getSectionContent(state, id)
    const sectionLevel = selectors.getSectionLevel(state, id)
    return {
      loading,
      content,
      title,
      sectionLevel,
    }
  }
  return { loading }
}

export default connect(mapStateToProps)(Content)
