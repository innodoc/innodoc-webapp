import React from 'react'
import { mount, shallow } from 'enzyme'
import { Result } from 'antd'
import { LoadingOutlined } from '@ant-design/icons'

import { api } from '@innodoc/client-misc'
import PageTitle from '../PageTitle'
import VerifyUserResult from './VerifyUserResult'
import LoginButton from '../LoginButton'

jest.mock('@innodoc/common/src/i18n')

jest.mock('react-redux', () => ({
  useSelector: () => ({
    appRoot: 'http://app.example.com/',
    csrfToken: '123csrftoken',
  }),
}))

jest.mock('@innodoc/client-misc', () => ({
  api: { verifyUser: jest.fn() },
}))

jest.mock('../PageTitle', () => () => null)
jest.mock('../LoginButton', () => () => null)

describe('<VerifyUserResult />', () => {
  it('should render', () => {
    const wrapper = shallow(<VerifyUserResult token="123token" />)
    const result = wrapper.find(Result)
    expect(result.prop('extra')).toBeNull()
    expect(result.prop('icon')).toEqual(<LoadingOutlined />)
    expect(result.prop('status')).toEqual('info')
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.verification.pending.title')
  })

  it('should render with successful verify', async () => {
    expect.assertions(5)
    api.verifyUser.mockResolvedValue()
    const wrapper = mount(<VerifyUserResult token="123verifytoken" />)
    await waitForComponent(wrapper)
    expect(api.verifyUser).toBeCalledWith('123csrftoken', '123verifytoken')
    const result = wrapper.find(Result)
    const Extra = () => result.prop('extra')
    expect(shallow(<Extra />).is(LoginButton)).toBe(true)
    expect(result.prop('icon')).toBeNull()
    expect(result.prop('status')).toBe('success')
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.verification.success.title')
  })

  it('should render with failed verify', async () => {
    expect.assertions(4)
    api.verifyUser.mockRejectedValue()
    const wrapper = mount(<VerifyUserResult token="123verifytoken" />)
    await waitForComponent(wrapper)
    const result = wrapper.find(Result)
    expect(result.prop('extra')).toBeNull()
    expect(result.prop('icon')).toBeNull()
    expect(result.prop('status')).toBe('error')
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.verification.error.title')
  })
})
