import React from 'react'
import { shallow } from 'enzyme'
import { Alert } from 'antd'

import { ErrorPage } from './_error'
import Layout from '../components/Layout'

describe('<ErrorPage />', () => {
  it('should render 404 as info', () => {
    const wrapper = shallow(<ErrorPage t={() => {}} statusCode={404} />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    const alert = layout.find(Alert)
    expect(alert.exists()).toBe(true)
    expect(alert.prop('type')).toBe('info')
  })

  it('should render 500 as error', () => {
    const wrapper = shallow(<ErrorPage t={() => {}} statusCode={500} />)
    expect(wrapper.find(Alert).prop('type')).toBe('error')
  })

  describe('getInitialProps', () => {
    it('should extract status code from response', async () => {
      const { statusCode } = await ErrorPage.getInitialProps({ res: { statusCode: 500 } })
      expect(statusCode).toBe(500)
    })

    it('should extract status code from error object', async () => {
      const { statusCode } = await ErrorPage.getInitialProps({ err: { statusCode: 500 } })
      expect(statusCode).toBe(500)
    })
  })
})
