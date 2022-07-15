import React from 'react'
import { shallow } from 'enzyme'

import RequestPasswordResetPage from './RequestPasswordResetPage'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import RequestPasswordResetForm from '../user/RequestPasswordResetForm'

jest.mock('@innodoc/common/src/i18n')

describe('<RequestPasswordResetPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<RequestPasswordResetPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(RequestPasswordResetForm).exists()).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.requestPasswordReset.title')
  })
})
