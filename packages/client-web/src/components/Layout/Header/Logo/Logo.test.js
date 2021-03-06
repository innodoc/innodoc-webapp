import React from 'react'
import { shallow } from 'enzyme'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import Logo from './Logo'

const mockGetCurrentCourse = courseSelectors.getCurrentCourse
const mockApp = {
  language: 'en',
  staticRoot: 'https://example.com/_static/',
}
let mockCurrentCourse = {
  title: { en: 'Foo course' },
  logo: 'logo.png',
}

jest.mock('react-redux', () => ({
  useSelector: (selector) => {
    if (selector === mockGetCurrentCourse) {
      return mockCurrentCourse
    }
    return mockApp
  },
}))

describe('<Logo />', () => {
  it('should render', () => {
    const wrapper = shallow(<Logo />)
    const logoDiv = wrapper.children('div')
    expect(logoDiv.prop('style').backgroundImage).toMatch('https://example.com/_static/logo.png')
    expect(wrapper.find('span').text()).toBe('Foo course')
  })

  it('should render w/o logo', () => {
    mockCurrentCourse = { title: { en: 'Foo course' } }
    const wrapper = shallow(<Logo />)
    expect(wrapper.children('div')).toHaveLength(0)
  })
})
