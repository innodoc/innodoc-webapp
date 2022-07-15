import React from 'react'
import { shallow } from 'enzyme'

import VerifyUserPage from './VerifyUserPage'
import Layout from '../Layout'
import VerifyUserResult from '../user/VerifyUserResult'

jest.mock('@innodoc/common/src/i18n')

describe('<VerifyUserPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<VerifyUserPage token="123Token!" />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(VerifyUserResult).prop('token')).toBe('123Token!')
  })

  describe('getInitialProps', () => {
    it('should extract token', () => {
      const ctx = {
        query: { token: '123Token!' },
      }
      expect(VerifyUserPage.getInitialProps(ctx).token).toEqual('123Token!')
    })
  })
})
