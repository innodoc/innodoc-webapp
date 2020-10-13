import React from 'react'
import { shallow } from 'enzyme'

import ResetPasswordPage from './ResetPasswordPage'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import ResetPasswordForm from '../user/ResetPasswordForm'

jest.mock('@innodoc/common/src/i18n')

describe('<ResetPasswordPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<ResetPasswordPage token="123Token!" />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(ResetPasswordForm).prop('token')).toBe('123Token!')
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.resetPassword.title')
  })

  describe('getInitialProps', () => {
    it('should extract token', () => {
      const ctx = {
        query: { token: '123Token!' },
      }
      expect(ResetPasswordPage.getInitialProps(ctx).token).toEqual('123Token!')
    })
  })
})
