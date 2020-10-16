import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'antd'
import { LoginOutlined } from '@ant-design/icons'

import LoginButton from './LoginButton'

const mockPush = jest.fn()
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('@innodoc/common/src/i18n')

describe('<LoginButton />', () => {
  it('should render', () => {
    const wrapper = shallow(<LoginButton />)
    const button = wrapper.find(Button)
    expect(button.prop('icon')).toEqual(<LoginOutlined />)
    expect(button.prop('children')).toBe('user.login.title')
  })

  it('should push "/login" route on click', () => {
    shallow(<LoginButton />)
      .find(Button)
      .simulate('click')
    expect(mockPush).toBeCalledWith('/login')
  })
})
