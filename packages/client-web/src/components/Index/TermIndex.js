import React, { useContext, useState } from 'react'
import classNames from 'classnames'
import { debounce } from 'lodash-es'
import { useSelector } from 'react-redux'
import { Divider, Empty, Input, List, Tag } from 'antd'
import MathJax from '@innodoc/react-mathjax-node'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import appSelectors from '@innodoc/client-store/src/selectors'
import indexTermSelectors from '@innodoc/client-store/src/selectors/indexTerm'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'
import { SectionLink } from '../content/links'
import css from './style.sss'

import parseTermName from './parseTermName'

const renderTerm = ([term, show]) => {
  const title = <strong>{parseTermName(term.name)}</strong>
  const links = term.locations.map((id) => (
    <Tag key={id}>
      <SectionLink contentId={id} />
    </Tag>
  ))
  const style = show ? null : { display: 'none' }
  return (
    <List.Item key={term.id} style={style}>
      <List.Item.Meta title={title} />
      <div className={css.tagList}>{links}</div>
    </List.Item>
  )
}

const EmptyList = () => {
  const { t } = useTranslation()
  return (
    <Empty
      description={t('index.emptyText')}
      image={Empty.PRESENTED_IMAGE_SIMPLE}
    />
  )
}

const Index = () => {
  const { language } = useSelector(appSelectors.getApp)
  const allIndexTerms = useSelector((state) =>
    indexTermSelectors.getIndexTerms(state, language)
  )
  const { typesetDone } = useContext(MathJax.Context)
  const fadeInClassName = classNames({
    [fadeInCss.show]: typesetDone,
    [fadeInCss.hide]: !typesetDone,
  })
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const indexTerms = allIndexTerms.map((term) => [
    term,
    term.name.toLowerCase().indexOf(q) >= 0,
  ])
  const empty = indexTerms.every(([, show]) => !show)
  const onChange = debounce((e) => setQ(e.target.value.toLowerCase()), 150, {
    leading: true,
  })

  return (
    <>
      <Input.Search
        allowClear
        placeholder={t('index.searchPlaceholder')}
        onChange={onChange}
      />
      <Divider />
      <div className={fadeInClassName}>
        <List
          dataSource={indexTerms}
          locale={{ emptyText: null }}
          renderItem={renderTerm}
        />
        {empty ? <EmptyList /> : null}
      </div>
    </>
  )
}

export default Index
