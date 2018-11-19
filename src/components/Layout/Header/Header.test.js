import React from 'react'
import { shallow } from 'enzyme'
import AntLayout from 'antd/lib/layout'
import Menu from 'antd/lib/menu'
import Button from 'antd/lib/button'

import { Header } from './Header'

describe('<Header />', () => {
  const mockDispatchChangeLanguage = jest.fn()
  const mockDispatchToggleSidebar = jest.fn()
  const wrapper = shallow(
    <Header
      languages={['de', 'en']}
      dispatchChangeLanguage={mockDispatchChangeLanguage}
      dispatchToggleSidebar={mockDispatchToggleSidebar}
      disableSidebar={false}
      t={() => {}}
      sidebarVisible
    />
  )

  it('should render Header', () => {
    expect(wrapper.find(AntLayout.Header).exists()).toBe(true)
  })

  it('should render menu', () => {
    expect(wrapper.find(Menu).exists()).toBe(true)
  })

  it('should toggle sidebar', () => {
    wrapper.find(Button).at(1).simulate('click')
    expect(mockDispatchToggleSidebar.mock.calls).toHaveLength(1)
  })

  describe('user menu', () => {
    const dropdown = wrapper.find(Menu.SubMenu).at(0)

    it('should render dropdown', () => {
      expect(dropdown.exists()).toBe(true)
    })
    it('should have 2 items', () => {
      expect(dropdown.find(Menu.Item)).toHaveLength(2)
    })
  })

  describe('language menu', () => {
    // TODO: dynamic list of languages
    const dropdown = wrapper.find(Menu.SubMenu).at(1)

    it('should render dropdown', () => {
      expect(dropdown.exists()).toBe(true)
    })

    it('should have 2 items', () => {
      expect(dropdown.find(Menu.Item)).toHaveLength(2)
    })

    describe('switch language', () => {
      it('should switch language to DE', () => {
        dropdown.find(Menu.Item).at(0).simulate('click')
        expect(mockDispatchChangeLanguage.mock.calls).toHaveLength(1)
        expect(mockDispatchChangeLanguage.mock.calls[0][0]).toBe('de')
      })

      it('should switch language to EN', () => {
        dropdown.find(Menu.Item).at(1).simulate('click')
        expect(mockDispatchChangeLanguage.mock.calls).toHaveLength(2)
        expect(mockDispatchChangeLanguage.mock.calls[1][0]).toBe('en')
      })
    })
  })
})
