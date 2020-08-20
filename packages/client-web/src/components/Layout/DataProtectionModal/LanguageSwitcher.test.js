import React from 'react'
import { mount } from 'enzyme'
import { Dropdown, Menu } from 'antd'

import appSelectors from '@innodoc/client-store/src/selectors'

import LanguageSwitcher from './LanguageSwitcher'
import css from './style.sss'

jest.mock('ionicons/dist/svg/language-outline.svg', () => () => null)

const mockApp = { language: 'en' }
const mockCourse = {
  currentSectionId: 'foo',
  homeLink: '/section/foo',
  languages: ['de', 'en'],
  title: { en: ['Foobar'] },
}
const mockDispatch = jest.fn()
const mockAppSelectors = appSelectors
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) => (selector === mockAppSelectors.getApp ? mockApp : mockCourse),
}))

describe('<LanguageSwitcher />', () => {
  it('should render', () => {
    const wrapper = mount(<LanguageSwitcher />)
    wrapper.find(Dropdown).simulate('click')
    expect(wrapper.exists(Menu)).toBe(true)
    const items = wrapper.find(Menu.Item)
    expect(items).toHaveLength(2)
    expect(items.at(0).hasClass(css.active)).toBe(false)
    expect(items.at(1).hasClass(css.active)).toBe(true)
  })

  describe.each(mockCourse.languages)('language %s', (lang) => {
    beforeEach(mockDispatch.mockClear)

    it('should dispatch changeLanguage', () => {
      const wrapper = mount(<LanguageSwitcher />)
      wrapper.find(Dropdown).simulate('click')
      const idx = mockCourse.languages.indexOf(lang)
      wrapper.find(Menu.Item).at(idx).simulate('click')
      expect(mockDispatch.mock.calls).toHaveLength(1)
      expect(mockDispatch.mock.calls[0][0].language).toBe(lang)
    })
  })
})
