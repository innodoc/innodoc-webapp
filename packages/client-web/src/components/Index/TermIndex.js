import React, { useContext } from 'react'
import classNames from 'classnames'
import { useSelector } from 'react-redux'
import { List, Tag } from 'antd'
import MathJax from '@innodoc/react-mathjax-node'

import appSelectors from '@innodoc/client-store/src/selectors'
import indexTermSelectors from '@innodoc/client-store/src/selectors/indexTerm'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'
import { SectionLink } from '../content/links'
import css from './style.sss'

const parseName = (term) => {
  const name = []
  let index = 0
  let remain = term
  while (remain.length > 0) {
    let match = remain.match(/^([^$]+)/)
    if (match) {
      const [, content] = match
      name.push(<span key={index}>{content}</span>)
      remain = remain.slice(content.length)
      index += 1
    } else {
      match = remain.match(/^\$([^$]+)\$/)
      if (match) {
        const [, content] = match
        name.push(<MathJax.Span key={index} texCode={content} />)
        remain = remain.slice(content.length + 2)
        index += 1
      } else {
        throw new Error(`Could not parse index term: ${term}`)
      }
    }
  }
  return name
}

const renderTerm = (term) => {
  const title = <strong>{parseName(term.name)}</strong>
  const links = term.locations.map((id) => (
    <Tag key={id}>
      <SectionLink contentId={id} />
    </Tag>
  ))
  return (
    <List.Item key={term.id}>
      <List.Item.Meta title={title} />
      <div className={css.tagList}>{links}</div>
    </List.Item>
  )
}

const Index = () => {
  const { language } = useSelector(appSelectors.getApp)
  const indexTerms = useSelector((state) =>
    indexTermSelectors.getIndexTerms(state, language)
  )
  const { typesetDone } = useContext(MathJax.Context)
  const fadeInClassName = classNames({
    [fadeInCss.show]: typesetDone,
    [fadeInCss.hide]: !typesetDone,
  })

  return (
    <div className={fadeInClassName}>
      <List dataSource={indexTerms} renderItem={renderTerm} />
    </div>
  )
}

export default Index
