import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'antd'

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
  it('renders', () => {
    const CustomIcon = () => 'BarIcon'
    const wrapper = shallow(<ToggleButton className="foo" icon={<CustomIcon />} />)
    expect(wrapper.hasClass('foo')).toBe(true)
    const IconComp = () => wrapper.prop('icon')
    const iconWrapper = shallow(<IconComp />)
    expect(iconWrapper.type()).toBe(CustomIcon)
  })

  it.each([
    ['enabled', true, 'common.hideToc'],
    ['disabled', false, 'common.showToc'],
  ])('renders with %s sidebar', (_, sidebarVisible, title) => {
    mockApp = { sidebarVisible }
    const wrapper = shallow(<ToggleButton />)
    expect(wrapper.find(Button).prop('title')).toBe(title)
  })

  it('dispatches toggleSidebar', () => {
    const wrapper = shallow(<ToggleButton />)
    wrapper.find(Button).simulate('click')
    expect(mockDispatch).toBeCalledWith(toggleSidebar())
  })
})
