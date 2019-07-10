import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import Affix from 'antd/lib/affix'

import useContentPane from '../hooks/useContentPane'
import css from './style.sass'
import sectionSelectors from '../../store/selectors/section'
import ContentFragment from './ContentFragment'
import Breadcrumb from './Breadcrumb'
import SectionNav from './SectionNav'
import SubsectionList from './SubsectionList'

const Content = () => {
  const {
    content,
    fadeInClassName,
    mathJaxElem,
  } = useContentPane(sectionSelectors.getCurrentSection)
  const [affixed, setAffixState] = useState(false)

  const subsections = useSelector(sectionSelectors.getCurrentSubsections)
  const title = useSelector(sectionSelectors.getCurrentTitle)
  const affixClassNames = classNames(
    css.sectionAffix,
    'clearfix',
    { [css.affixed]: affixed }
  )

  const subsectionList = subsections.length
    ? <SubsectionList subsections={subsections} />
    : null
  const contentDiv = (
    <div className={fadeInClassName} id="content">
      <h1 className={css.header}>{title}</h1>
      {subsectionList}
      <div ref={mathJaxElem}>
        <ContentFragment content={content} />
      </div>
    </div>
  )

  return (
    <React.Fragment>
      <Affix onChange={newAffixed => setAffixState(newAffixed)}>
        <div className={affixClassNames}>
          <SectionNav />
          <Breadcrumb />
        </div>
      </Affix>
      {contentDiv}
    </React.Fragment>
  )
}

export default Content
