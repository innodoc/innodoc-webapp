import React from 'react'
import { shallow } from 'enzyme'

import RequestVerificationPage from './RequestVerificationPage'
import Layout from '../Layout'
import PageTitle from '../PageTitle'
import RequestVerificationForm from '../user/RequestVerificationForm'

jest.mock('@innodoc/common/src/i18n')

describe('<RequestVerificationPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<RequestVerificationPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    expect(layout.find(RequestVerificationForm).exists()).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('user.requestVerification.title')
  })
})
