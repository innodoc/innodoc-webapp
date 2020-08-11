import React from 'react'
import { shallow } from 'enzyme'
import Head from 'next/head'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import PageTitle from './PageTitle'

const mockGetCurrentCourse = courseSelectors.getCurrentCourse

jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetCurrentCourse) {
      return { title: { en: 'CourseTitle' } }
    }
    return { language: 'en' }
  },
}))

describe('<PageTitle>', () => {
  it('should set page title using next/head', () => {
    const wrapper = shallow(<PageTitle />)
    expect(wrapper.exists(Head)).toBe(true)
    expect(wrapper.find('title').prop('children')).toBe('CourseTitle')
  })

  it('should prefix page title', () => {
    const wrapper = shallow(<PageTitle>Sub page</PageTitle>)
    expect(wrapper.find('title').prop('children')).toBe('Sub page · CourseTitle')
  })
})
