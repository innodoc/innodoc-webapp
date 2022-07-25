import { Divider, Empty, Input, List, Tag } from 'antd'
import classNames from 'classnames'
import { debounce } from 'lodash-es'
import { useTranslation } from 'next-i18next'
import { useContext, useState } from 'react'
import { useSelector } from 'react-redux'

import MathJax from '@innodoc/react-mathjax-node'
import getIndexTerms from '@innodoc/store/selectors/getIndexTerms'
import { getApp } from '@innodoc/store/selectors/misc'

import fadeInCss from '../../style/fade-in.module.sss'
import SectionLink from '../content/links/SectionLink.js'

import css from './TermIndex.module.sss'
import TermNameTitle from './TermNameTitle.jsx'

const renderTerm = ([term, show]) => {
  const title = <TermNameTitle term={term.name} />

  const links = term.locations.map(({ id, contentId }) => (
    <Tag key={id}>
      <SectionLink contentId={contentId} />
    </Tag>
  ))

  return (
    <List.Item key={term.id} style={show ? null : { display: 'none' }}>
      <List.Item.Meta title={title} />
      <div className={css.tagList}>{links}</div>
    </List.Item>
  )
}

function EmptyList() {
  const { t } = useTranslation()
  return <Empty description={t('index.emptyText')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
}

function TermIndex() {
  const { language } = useSelector(getApp)
  const allIndexTerms = useSelector((state) => getIndexTerms(state, language))
  const { typesetDone } = useContext(MathJax.Context)
  const fadeInClassName = classNames({
    [fadeInCss.show]: typesetDone,
    [fadeInCss.hide]: !typesetDone,
  })
  const { t } = useTranslation()
  const [q, setQ] = useState('')
  const indexTerms = allIndexTerms.map((term) => [term, term.name.toLowerCase().indexOf(q) >= 0])
  const empty = indexTerms.every(([, show]) => !show)
  const onChange = debounce((e) => setQ(e.target.value.toLowerCase()), 150, {
    leading: true,
  })

  return (
    <>
      <Input.Search allowClear placeholder={t('index.searchPlaceholder')} onChange={onChange} />
      <Divider />
      <div className={fadeInClassName}>
        <List dataSource={indexTerms} locale={{ emptyText: null }} renderItem={renderTerm} />
        {empty ? <EmptyList /> : null}
      </div>
    </>
  )
}

export default TermIndex
