import React from 'react'
import { shallow } from 'enzyme'

import ChangePasswordPage from './ChangePasswordPage'
import useRequireLogin from '../../hooks/useRequireLogin'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import ChangePasswordForm from '../user/ChangePasswordForm'

jest.mock('@innodoc/common/src/i18n')
jest.mock('../../hooks/useRequireLogin', () => jest.fn())

describe('<ChangePasswordPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<ChangePasswordPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(ChangePasswordForm).exists()).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.changePassword.title')
  })

  it('should require login', () => {
    shallow(<ChangePasswordPage />)
    expect(useRequireLogin).toBeCalled()
  })
})
