import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import useContentPane from '../../hooks/useContentPane'
import css from './style.sss'
import ContentFragment from './ContentFragment'
import ContentAffix from './ContentAffix'
import SubsectionList from './SubsectionList'

const Content = ({ numFormulars }) => {
  const {
    content,
    fadeInClassName,
    // mathJaxElem,
  } = useContentPane(sectionSelectors.getCurrentSection)
  const subsections = useSelector(sectionSelectors.getCurrentSubsections)
  const title = useSelector(sectionSelectors.getCurrentTitle)

  const subsectionList = subsections.length
    ? <SubsectionList subsections={subsections} />
    : null

  return (
    <>
      <ContentAffix />
      <div className={fadeInClassName} id="content">
        <h1 className={css.header}>{title}</h1>
        {subsectionList}
        <ContentFragment content={content} />
      </div>
    </>
  )
}

Content.propTypes = {
  numFormulars: PropTypes.number.isRequired,
}

export default Content
