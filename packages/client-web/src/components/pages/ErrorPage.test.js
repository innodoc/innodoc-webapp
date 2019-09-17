import React from 'react'
import { shallow } from 'enzyme'
import Result from 'antd/es/result'

import ErrorPage from './ErrorPage'
import Layout from '../Layout'

jest.mock('react-redux', () => ({
  useSelector: () => ({ homeLink: '/home/link' }),
}))

let mockRouter
jest.mock('next/router', () => ({
  useRouter: () => mockRouter,
}))

describe('<ErrorPage />', () => {
  beforeEach(() => {
    mockRouter = { asPath: '/current/url', replace: jest.fn() }
  })

  it.each([404, 500])('should render %s', (statusCode) => {
    const wrapper = shallow(<ErrorPage statusCode={statusCode} />)
    expect(wrapper.exists(Layout)).toBe(true)
    const result = wrapper.find(Result)
    expect(result.prop('status')).toBe(statusCode.toString())
    expect(result.prop('subTitle')).toEqual([`errorPage.${statusCode}.msg`, 'errorPage.unspecific.msg'])
    expect(result.prop('title')).toEqual([`errorPage.${statusCode}.title`, 'errorPage.unspecific.title'])
    expect(result.prop('extra').props.href).toBe('/home/link')
    expect(mockRouter.replace).not.toBeCalled()
  })

  it('should call router.replace() if without statusCode', () => {
    shallow(<ErrorPage />)
    expect(mockRouter.replace).toBeCalledWith('/current/url')
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
