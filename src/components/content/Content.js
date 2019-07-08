import React from 'react'
import Router from 'next/router'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import fadeInCss from '../../style/fadeIn.sass'
import css from './style.sass'
import appSelectors from '../../store/selectors'
import sectionSelectors from '../../store/selectors/section'
import { typesetStates, useMathJaxScanElement } from '../../hooks/useMathJax'
import ContentFragment from './ContentFragment'
import Breadcrumb from './Breadcrumb'
import SectionNav from './SectionNav'
import SubsectionList from './SubsectionList'

const scrollToHash = () => {
  if (process.browser) {
    Router.router.scrollToHash(Router.router.asPath)
  }
}

const Content = () => {
  const { language } = useSelector(appSelectors.getApp)
  const section = useSelector(sectionSelectors.getCurrentSection)
  const subsections = useSelector(sectionSelectors.getCurrentSubsections)
  const title = useSelector(sectionSelectors.getCurrentTitle)
  const loading = !language || !section || !section.content[language]
  const { mathJaxElem, typesetState } = useMathJaxScanElement([language, section], scrollToHash)
  const show = !loading && typesetState === typesetStates.SUCCESS
  const fadeInClassName = classNames({
    [fadeInCss.show]: show,
    [fadeInCss.hide]: !show,
  })

  const subsectionList = subsections.length
    ? <SubsectionList subsections={subsections} />
    : null

  const rootContentFragment = loading
    ? null
    : <ContentFragment content={section.content[language]} />

  const content = (
    <div className={fadeInClassName}>
      <h1 className={css.header}>{title}</h1>
      {subsectionList}
      <div ref={mathJaxElem}>{rootContentFragment}</div>
    </div>
  )

  return (
    <React.Fragment>
      <SectionNav />
      <Breadcrumb />
      {content}
    </React.Fragment>
  )
}

export default Content
