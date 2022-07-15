import React from 'react'
import { useSelector } from 'react-redux'
import { Typography } from 'antd'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import useContentPane from '../../hooks/useContentPane'
import useTrackVisit from '../../hooks/useTrackVisit'
import PageTitle from '../common/PageTitle'
import ContentFragment from './ContentFragment'
import ContentAffix from './ContentAffix'
import SubsectionList from './SubsectionList'
import TestContent from './TestContent'

const Content = () => {
  const { content, fadeInClassName, id, type } = useContentPane(sectionSelectors.getCurrentSection)
  useTrackVisit(id)
  const subsections = useSelector(sectionSelectors.getCurrentSubsections)
  const title = useSelector(sectionSelectors.getCurrentTitle)

  const titleComp = <Typography.Title>{title}</Typography.Title>
  const subsectionList = subsections.length ? <SubsectionList subsections={subsections} /> : null
  const contentFragment = <ContentFragment content={content} />
  const contentInner =
    type === 'test' ? (
      <>
        {titleComp}
        <TestContent id={id}>{contentFragment}</TestContent>
      </>
    ) : (
      <>
        {titleComp}
        {subsectionList}
        {contentFragment}
      </>
    )

  return (
    <>
      <PageTitle>{title}</PageTitle>
      <ContentAffix />
      <div className={fadeInClassName} id="content">
        {contentInner}
      </div>
    </>
  )
}

export default Content
