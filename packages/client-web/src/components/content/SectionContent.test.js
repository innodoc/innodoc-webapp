import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import useTrackVisit from '../../hooks/useTrackVisit'
import PageTitle from '../PageTitle'
import SectionContent from './SectionContent'
import SubsectionList from './SubsectionList'
import ContentAffix from './ContentAffix'
import ContentFragment from './ContentFragment'

const mockGetCurrentSubsections = sectionSelectors.getCurrentSubsections

let mockContent
let mockCurrentSubsections
let mockCurrentTitle

jest.mock('../../hooks/useTrackVisit', () => jest.fn())

jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetCurrentSubsections) {
      return mockCurrentSubsections
    }
    return mockCurrentTitle
  },
}))

const mockRef = React.createRef()
jest.mock('../../hooks/useContentPane', () => () => ({
  content: mockContent,
  fadeInClassName: 'show',
  id: 'foo',
  mathJaxElem: mockRef,
}))

describe('<SectionContent />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockContent = [{ t: 'Str', c: 'A nice string' }]
    mockCurrentSubsections = [
      {
        content: { en: [] },
        id: 'bar-1',
        ord: [0, 0],
        title: { en: 'Bar section 1' },
      },
      {
        content: { en: [] },
        id: 'bar-2',
        ord: [0, 1],
        title: { en: 'Bar section 2' },
      },
    ]
    mockCurrentTitle = '1 Foo section'
  })

  it('should render', () => {
    const wrapper = shallow(<SectionContent />)
    expect(wrapper.exists(ContentAffix)).toBe(true)
    expect(wrapper.find(Typography.Title).children().text()).toBe(
      '1 Foo section'
    )
    expect(wrapper.find(PageTitle).prop('children')).toBe('1 Foo section')
    expect(wrapper.find(ContentFragment).prop('content')).toBe(mockContent)
    expect(wrapper.exists(SubsectionList)).toBe(true)
  })

  it('should track visit', () => {
    shallow(<SectionContent />)
    expect(useTrackVisit).toBeCalledWith('foo')
  })

  describe('missing data', () => {
    it('should render without sections', () => {
      mockCurrentSubsections = []
      const wrapper = shallow(<SectionContent />)
      expect(wrapper.exists(SubsectionList)).toBe(false)
    })
  })
})
