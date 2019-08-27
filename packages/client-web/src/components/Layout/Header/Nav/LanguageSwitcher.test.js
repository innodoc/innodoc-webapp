import React from 'react'
import { shallow } from 'enzyme'
import Menu from 'antd/lib/menu'

import LanguageSwitcher from './LanguageSwitcher'

const mockCourse = {
  currentSection: 'foo',
  homeLink: 'foo',
  languages: ['de', 'en'],
  title: { en: ['Foobar'] },
}
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockCourse,
}))

describe('<LanguageSwitcher />', () => {
  describe('render', () => {
    const wrapper = shallow(
      <LanguageSwitcher />
    )

    it('should render dropdown', () => {
      expect(wrapper.find(Menu.SubMenu).exists()).toBe(true)
    })

    it('should have 2 items', () => {
      expect(wrapper.find(Menu.Item)).toHaveLength(2)
    })
  })

  describe.each(mockCourse.languages)('language %s', (lang) => {
    beforeEach(mockDispatch.mockClear)

    it('should dispatch changeLanguage', () => {
      const wrapper = shallow(
        <LanguageSwitcher />
      )
      const idx = mockCourse.languages.indexOf(lang)
      wrapper.find(Menu.SubMenu).find(Menu.Item).at(idx).simulate('click')
      expect(mockDispatch.mock.calls).toHaveLength(1)
      expect(mockDispatch.mock.calls[0][0].language).toBe(lang)
    })
  })
})
