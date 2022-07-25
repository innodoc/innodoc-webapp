import { Typography } from 'antd'
import { useSelector } from 'react-redux'

import {
  getCurrentSection,
  getCurrentSubsections,
  getCurrentTitle,
} from '@innodoc/store/selectors/section'

import useContentPane from '../../hooks/useContentPane.js'
import useTrackVisit from '../../hooks/useTrackVisit.js'
import PageTitle from '../common/PageTitle.jsx'

import ContentAffix from './ContentAffix/ContentAffix.jsx'
import ContentFragment from './ContentFragment/ContentFragment.jsx'
import SubsectionList from './SubsectionList/SubsectionList.jsx'
import TestContent from './TestContent.jsx'

function SectionContent() {
  const { content, fadeInClassName, id, type } = useContentPane(getCurrentSection)
  useTrackVisit(id)
  const subsections = useSelector(getCurrentSubsections)
  const title = useSelector(getCurrentTitle)

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

export default SectionContent
