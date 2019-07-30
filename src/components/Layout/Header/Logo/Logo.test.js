import React from 'react'
import { shallow } from 'enzyme'

import Logo from './Logo'
import courseSelectors from '../../../../store/selectors/course'

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
    const logoImg = wrapper.find('img')
    expect(logoImg.prop('alt')).toBe('Foo course')
    expect(logoImg.prop('src')).toBe('https://example.com/_static/logo.png')
    expect(wrapper.find('span').text()).toBe('Foo course')
  })

  it('should render w/o logo', () => {
    mockCurrentCourse = { title: { en: 'Foo course' } }
    const wrapper = shallow(<Logo />)
    expect(wrapper.exists('img')).toBe(false)
  })
})
