import React from 'react'
import { shallow } from 'enzyme'
import { Menu } from 'antd'

import appSelectors from '@innodoc/client-store/src/selectors'

import LanguageSwitcher from './LanguageSwitcher'
import css from './style.sss'

const mockApp = { language: 'de' }
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
    const wrapper = shallow(<LanguageSwitcher />)
    expect(wrapper.find(Menu.SubMenu).exists()).toBe(true)
    const items = wrapper.find(Menu.Item)
    expect(items).toHaveLength(2)
    expect(items.at(0).hasClass(css.active)).toBe(true)
    expect(items.at(1).hasClass(css.active)).toBe(false)
  })

  describe.each(mockCourse.languages)('language %s', (lang) => {
    beforeEach(mockDispatch.mockClear)

    it('should dispatch changeLanguage', () => {
      const wrapper = shallow(<LanguageSwitcher />)
      const idx = mockCourse.languages.indexOf(lang)
      wrapper.find(Menu.SubMenu).find(Menu.Item).at(idx).simulate('click')
      expect(mockDispatch.mock.calls).toHaveLength(1)
      expect(mockDispatch.mock.calls[0][0].language).toBe(lang)
    })
  })
})
