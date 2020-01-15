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

import parseTermName from './parseTermName'

const renderTerm = (term) => {
  const title = <strong>{parseTermName(term.name)}</strong>
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
