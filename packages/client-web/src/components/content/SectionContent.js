import React from 'react'
import { useSelector } from 'react-redux'
import { Typography } from 'antd'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import useContentPane from '../../hooks/useContentPane'
import useTrackVisit from '../../hooks/useTrackVisit'
import PageTitle from '../PageTitle'
import ContentFragment from './ContentFragment'
import ContentAffix from './ContentAffix'
import SubsectionList from './SubsectionList'

const Content = ({ content, title }) => {
  // const { content, fadeInClassName, id } = useContentPane(sectionSelectors.getCurrentSection)
  const fadeInClassName = ''
  // useTrackVisit(id)
  // const subsections = useSelector(sectionSelectors.getCurrentSubsections)
  // const title = useSelector(sectionSelectors.getCurrentTitle)

  // const subsectionList = subsections.length ? <SubsectionList subsections={subsections} /> : null
  const subsectionList = []

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <ContentAffix />
      <div className={fadeInClassName} id="content">
        <Typography.Title>{title}</Typography.Title>
        {subsectionList}
        <ContentFragment content={content} />
      </div>
    </>
  )
}

export default Content
