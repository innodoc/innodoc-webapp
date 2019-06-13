import React from 'react'
import { shallow } from 'enzyme'
import Menu from 'antd/lib/menu'

import { BareLanguageSwitcher as LanguageSwitcher } from './LanguageSwitcher'

describe('<LanguageSwitcher />', () => {
  const course = {
    currentSection: 'foo',
    homeLink: 'foo',
    languages: ['de', 'en'],
    title: { en: ['Foobar'] },
  }

  describe('render', () => {
    const wrapper = shallow(
      <LanguageSwitcher course={course} dispatchChangeLanguage={() => {}} />
    )
    it('should render dropdown', () => {
      expect(wrapper.find(Menu.SubMenu).exists()).toBe(true)
    })
    it('should have 2 items', () => {
      expect(wrapper.find(Menu.Item)).toHaveLength(2)
    })
  })

  describe.each(course.languages)('language %s', (lang) => {
    const mockDispatchChangeLanguage = jest.fn()
    it('should dispatch changeLanguage', () => {
      const wrapper = shallow(
        <LanguageSwitcher course={course} dispatchChangeLanguage={mockDispatchChangeLanguage} />
      )
      const idx = course.languages.indexOf(lang)
      wrapper.find(Menu.SubMenu).find(Menu.Item).at(idx).simulate('click')
      expect(mockDispatchChangeLanguage.mock.calls).toHaveLength(1)
      expect(mockDispatchChangeLanguage.mock.calls[0][0]).toBe(lang)
    })
  })
})
