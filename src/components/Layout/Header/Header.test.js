import React from 'react'
import { shallow } from 'enzyme'
import { Menu, Dropdown } from 'semantic-ui-react'

import { Header } from './Header'

describe('<Header />', () => {
  const mockDispatchChangeLanguage = jest.fn()
  const wrapper = shallow(
    <Header t={() => {}} dispatchChangeLanguage={mockDispatchChangeLanguage} />
  )

  it('should render menu', () => {
    expect(wrapper.find(Menu).exists()).toBe(true)
  })

  describe('user menu', () => {
    const dropdown = wrapper.find(Dropdown).at(0)

    it('should render dropdown', () => {
      expect(dropdown.exists()).toBe(true)
    })
    it('should have 2 items', () => {
      expect(dropdown.find(Dropdown.Item)).toHaveLength(2)
    })
  })

  describe('language menu', () => {
    const dropdown = wrapper.find(Dropdown).at(1)

    it('should render dropdown', () => {
      expect(dropdown.exists()).toBe(true)
    })

    it('should have 2 items', () => {
      expect(dropdown.find(Dropdown.Item)).toHaveLength(2)
    })

    describe('switch language', () => {
      it('should switch language to EN', () => {
        dropdown.find(Dropdown.Item).at(0).simulate('click')
        expect(mockDispatchChangeLanguage.mock.calls).toHaveLength(1)
        expect(mockDispatchChangeLanguage.mock.calls[0][0]).toBe('en')
      })

      it('should switch language to DE', () => {
        dropdown.find(Dropdown.Item).at(1).simulate('click')
        expect(mockDispatchChangeLanguage.mock.calls).toHaveLength(2)
        expect(mockDispatchChangeLanguage.mock.calls[1][0]).toBe('de')
      })
    })
  })
})
