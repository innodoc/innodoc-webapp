import React from 'react'
import { shallow } from 'enzyme'

import useRequireLogin from '../../hooks/useRequireLogin'
import DeleteAccountPage from './DeleteAccountPage'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import DeleteAccountForm from '../user/DeleteAccountForm'

jest.mock('@innodoc/common/src/i18n')
jest.mock('../../hooks/useRequireLogin', () => jest.fn())

describe('<DeleteAccountPage />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render', () => {
    const wrapper = shallow(<DeleteAccountPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(DeleteAccountForm).exists()).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.deleteAccount.title')
  })

  it('should require login', () => {
    shallow(<DeleteAccountPage />)
    expect(useRequireLogin).toBeCalled()
  })
})
