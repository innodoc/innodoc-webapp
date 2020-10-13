import React from 'react'
import { shallow } from 'enzyme'
import { Result } from 'antd'

import ErrorPage from './ErrorPage'
import Layout from '../Layout'
import PageTitle from '../PageTitle'

jest.mock('@innodoc/common/src/i18n')

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
    expect(result.prop('subTitle')).toEqual(`errorPage.${statusCode}.msg_errorPage.unspecific.msg`)
    expect(result.prop('title')).toEqual(`errorPage.${statusCode}.title_errorPage.unspecific.title`)
    expect(result.prop('extra').props.href).toBe('/home/link')
    expect(mockRouter.replace).not.toBeCalled()
    expect(wrapper.find(PageTitle).prop('children')).toBe(
      `errorPage.${statusCode}.title_errorPage.unspecific.title`
    )
  })

  describe('getInitialProps', () => {
    it('should extract status code from response', async () => {
      expect.assertions(1)
      const { statusCode } = await ErrorPage.getInitialProps({
        res: { statusCode: 500 },
      })
      expect(statusCode).toBe(500)
    })

    it('should extract status code from error object', async () => {
      expect.assertions(1)
      const { statusCode } = await ErrorPage.getInitialProps({
        err: { statusCode: 500 },
      })
      expect(statusCode).toBe(500)
    })
  })
})
