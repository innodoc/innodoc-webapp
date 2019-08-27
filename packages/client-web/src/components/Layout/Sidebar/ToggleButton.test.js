import React from 'react'
import { shallow } from 'enzyme'
import Button from 'antd/lib/button'

import { toggleSidebar } from '@innodoc/client-store/src/actions/ui'

import ToggleButton from './ToggleButton'

let mockApp
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockApp,
}))

beforeEach(() => {
  mockDispatch.mockClear()
  mockApp = { sidebarVisible: true }
})

describe('<ToggleButton />', () => {
  it.each([
    ['enabled', true],
    ['disabled', false],
  ])('renders with %s sidebar', (_, sidebarVisible) => {
    mockApp = { sidebarVisible }
    const wrapper = shallow(<ToggleButton />)
    expect(wrapper.find(Button).hasClass('active')).toBe(sidebarVisible)
  })

  it('dispatches toggleSidebar', () => {
    const wrapper = shallow(<ToggleButton />)
    wrapper.find(Button).simulate('click')
    expect(mockDispatch).toBeCalledWith(toggleSidebar())
  })
})
