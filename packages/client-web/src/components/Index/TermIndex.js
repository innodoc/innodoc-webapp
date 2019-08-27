import React from 'react'
import { useSelector } from 'react-redux'
import List from 'antd/lib/list'
import Tag from 'antd/lib/tag'

import appSelectors from '@innodoc/client-store/src/selectors'
import indexTermSelectors from '@innodoc/client-store/src/selectors/indexTerm'

import { SectionLink } from '../content/links'
import { useMathJaxScanElement } from '../../hooks/useMathJax'
import css from './style.sass'

const renderTerm = (term) => {
  const title = <strong>{term.name}</strong>
  const links = term.locations.map((id) => (
    <Tag key={id}>
      <SectionLink contentId={id} />
    </Tag>
  ))
  return (
    <List.Item key={term.id}>
      <List.Item.Meta title={title} />
      <div className={css.tagList}>
        {links}
      </div>
    </List.Item>
  )
}

const Index = () => {
  const { language } = useSelector(appSelectors.getApp)
  const { mathJaxElem } = useMathJaxScanElement([language])
  const indexTerms = useSelector((state) => indexTermSelectors.getIndexTerms(state, language))
  return (
    <div ref={mathJaxElem}>
      <List dataSource={indexTerms} renderItem={renderTerm} />
    </div>
  )
}

export default Index
