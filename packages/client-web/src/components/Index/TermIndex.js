import React from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import List from 'antd/lib/list'
import Tag from 'antd/lib/tag'

import appSelectors from '@innodoc/client-store/src/selectors'
import indexTermSelectors from '@innodoc/client-store/src/selectors/indexTerm'

import { SectionLink } from '../content/links'
import { mathDelimiter, useMathJaxScanElement, typesetStates } from '../../hooks/useMathJax'
import css from './style.sass'
import fadeInCss from '../../style/fadeIn.sass'

const { inline: inlineMathDelimiter } = mathDelimiter
const replaceLatexDelimiters = (str) => (
  str.replace(/\$([^$]+)\$/g, `${inlineMathDelimiter[0]}$1${inlineMathDelimiter[1]}`)
)

const renderTerm = (term) => {
  const title = <strong>{replaceLatexDelimiters(term.name)}</strong>
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
  const { mathJaxElem, typesetState } = useMathJaxScanElement([language])
  const indexTerms = useSelector((state) => indexTermSelectors.getIndexTerms(state, language))
  const show = typesetState === typesetStates.SUCCESS
  const fadeInClassName = classNames({
    [fadeInCss.show]: show,
    [fadeInCss.hide]: !show,
  })

  return (
    <div className={fadeInClassName} ref={mathJaxElem}>
      <List dataSource={indexTerms} renderItem={renderTerm} />
    </div>
  )
}

export default Index
