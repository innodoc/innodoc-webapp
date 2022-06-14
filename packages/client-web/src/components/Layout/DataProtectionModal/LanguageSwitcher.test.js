import React from 'react'
import { mount } from 'enzyme'
import { Dropdown, Menu } from 'antd'

import appSelectors from '@innodoc/client-store/src/selectors'

import LanguageSwitcher from './LanguageSwitcher'
import css from './style.sss'

jest.mock('@innodoc/common/src/i18n')
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
  it('should render', async () => {
    expect.assertions(5)

    const wrapper = mount(<LanguageSwitcher />)
    wrapper.find(Dropdown).simulate('click')
    await waitForComponent(wrapper)
    expect(wrapper.exists(Menu)).toBe(true)

    const menuItemDe = wrapper.findWhere(
      (node) => node.type() === Menu.Item && node.text() === 'languages.de'
    )
    expect(menuItemDe).toHaveLength(1)
    expect(menuItemDe.at(0).hasClass(css.active)).toBe(false)
    const menuItemEn = wrapper.findWhere(
      (node) => node.type() === Menu.Item && node.text() === 'languages.en'
    )
    expect(menuItemEn).toHaveLength(1)
    expect(menuItemEn.at(0).hasClass(css.active)).toBe(true)
  })

  describe.each(mockCourse.languages)('language %s', (lang) => {
    beforeEach(mockDispatch.mockClear)

    it('should dispatch changeLanguage', async () => {
      expect.assertions(2)
      const wrapper = mount(<LanguageSwitcher />)
      wrapper.find(Dropdown).simulate('click')
      await waitForComponent(wrapper)
      const idx = mockCourse.languages.indexOf(lang)
      wrapper.find(Menu.Item).at(idx).simulate('click')
      expect(mockDispatch.mock.calls).toHaveLength(1)
      expect(mockDispatch.mock.calls[0][0].language).toBe(lang)
    })
  })
})
