import React from 'react'
import { shallow } from 'enzyme'
import { Alert } from 'antd'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import ChapterCard from './ChapterCard'
import Progress from './Progress'

jest.mock('@innodoc/common/src/i18n')

const mockChapters = [
  {
    id: 'foo',
    progress: { moduleUnits: [] },
    title: 'Foo',
  },
  {
    id: 'bar',
    progress: { moduleUnits: [] },
    title: 'Bar',
  },
]

const mockCourse = { minScore: 90 }

const mockCourseSelectors = courseSelectors
jest.mock('react-redux', () => ({
  useSelector: (sel) => (sel === mockCourseSelectors.getCurrentCourse ? mockCourse : mockChapters),
}))

describe('<Progress />', () => {
  it('should render', () => {
    const wrapper = shallow(<Progress />)
    const cards = wrapper.find(ChapterCard)
    expect(cards).toHaveLength(2)
    expect(cards.at(0).prop('progress')).toBe(mockChapters[0].progress)
    expect(cards.at(0).prop('sectionId')).toBe('foo')
    expect(cards.at(0).prop('title')).toBe('Foo')
    expect(cards.at(1).prop('progress')).toBe(mockChapters[1].progress)
    expect(cards.at(1).prop('sectionId')).toBe('bar')
    expect(cards.at(1).prop('title')).toBe('Bar')
    const alert = wrapper.find(Alert)
    expect(alert.prop('description')).toBe('progress.introduction.description_90')
    expect(alert.prop('message')).toBe('progress.introduction.message')
  })
})
