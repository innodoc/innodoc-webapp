import React from 'react'
import { mount, shallow } from 'enzyme'
import { Button, Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { verifyUser } from '@innodoc/client-misc/src/api'
import VerifyUserResult from './VerifyUserResult'

jest.mock('react-redux', () => ({
  useSelector: () => ({
    appRoot: 'http://app.example.com/',
    csrfToken: '123csrftoken',
  }),
}))

jest.mock('@innodoc/client-misc/src/api', () => ({
  verifyUser: jest.fn(),
}))

describe('<VerifyUserResult />', () => {
  it('should render', () => {
    const wrapper = shallow(<VerifyUserResult token="123token" />)
    const result = wrapper.find(Result)
    expect(result.prop('extra')).toBeNull()
    expect(result.prop('icon')).toEqual(<LoadingOutlined />)
    expect(result.prop('status')).toEqual('info')
  })

  it('should render with successful verify', async () => {
    expect.assertions(5)
    verifyUser.mockResolvedValue()
    const wrapper = mount(<VerifyUserResult token="123verifytoken" />)
    await waitForComponent(wrapper)
    expect(verifyUser).toBeCalledWith(
      'http://app.example.com/',
      '123csrftoken',
      '123verifytoken'
    )
    const result = wrapper.find(Result)
    expect(result.prop('icon')).toBeNull()
    expect(result.prop('status')).toBe('success')
    const Extra = () => result.prop('extra')
    const extra = shallow(<Extra />)
    expect(extra.prop('href')).toBe('/login')
    expect(extra.exists(Button)).toBe(true)
  })

  it('should render with failed verify', async () => {
    expect.assertions(3)
    verifyUser.mockRejectedValue()
    const wrapper = mount(<VerifyUserResult token="123verifytoken" />)
    await waitForComponent(wrapper)
    const result = wrapper.find(Result)
    expect(result.prop('extra')).toBeNull()
    expect(result.prop('icon')).toBeNull()
    expect(result.prop('status')).toBe('error')
  })
})
