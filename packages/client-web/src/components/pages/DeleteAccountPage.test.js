import React from 'react'
import { shallow } from 'enzyme'

import DeleteAccountPage from './DeleteAccountPage'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import DeleteAccountForm from '../user/DeleteAccountForm'

describe('<DeleteAccountPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<DeleteAccountPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(DeleteAccountForm).exists()).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.deleteAccount.title')
  })
})
