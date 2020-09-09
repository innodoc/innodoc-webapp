import React from 'react'
import { shallow } from 'enzyme'

import { contentNotFound, loadPage, loadSection } from '@innodoc/client-store/src/actions/content'

import { PageContent, SectionContent } from '../content'
import Layout from '../Layout'
import ContentPage from './ContentPage'
import ErrorPage from './ErrorPage'

let mockApp
jest.mock('react-redux', () => ({ useSelector: () => mockApp }))
jest.mock('@innodoc/client-store/src/selectors', () => ({ getApp: () => mockApp }))

let mockServerContext
jest.mock('next-server-context', () => ({ useServerContext: () => mockServerContext }))

jest.mock('../content', () => ({ PageContent: () => {}, SectionContent: () => {} }))
jest.mock('../Layout', () => ({ children }) => <>{children}</>)
jest.mock('./ErrorPage', () => () => {})

const mockStore = {
  dispatch: jest.fn(),
  getState: () => {},
}

describe('ContentPage', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockApp = {
      language: 'en',
      pagePathPrefix: 'page',
      sectionPathPrefix: 'section',
      show404: false,
    }
    mockServerContext = { response: {} }
  })

  it.each([
    ['page', PageContent],
    ['section', SectionContent],
  ])('should render (%s)', (contentType, ContentComponent) => {
    const wrapper = shallow(<ContentPage contentType={contentType} />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).not.toBe(true)
    expect(layout.exists(ContentComponent)).toBe(true)
    expect(layout.exists(ErrorPage)).toBe(false)
  })

  it('should render 404', () => {
    mockApp.show404 = true
    const wrapper = shallow(<ContentPage contentType="page" />)
    expect(wrapper.find(ErrorPage).prop('statusCode')).toBe(404)
    expect(wrapper.find(Layout).exists()).toBe(false)
    expect(mockServerContext.response.statusCode).toBe(404)
  })

  describe('getInitialProps', () => {
    it.each([
      ['page', ['foo']],
      ['section', ['foo']],
      ['section', ['foo', 'bar']],
      ['section', ['foo', 'bar', 'baz']],
    ])(
      'should pass contentType prop and dispatch loadAction with valid params (%s, %s)',
      (contentPrefix, fragments) => {
        const query = { contentPrefix, fragments }
        const props = ContentPage.getInitialProps({ query, store: mockStore })
        const loadAction = contentPrefix === 'page' ? loadPage : loadSection
        expect(mockStore.dispatch).toBeCalledWith(loadAction(fragments.join('/'), 'en'))
        expect(props.contentType).toBe(contentPrefix)
      }
    )

    it.each([
      ['page', ['foo!']],
      ['page', ['foo', 'bar']],
      ['section', ['foo!']],
      ['section', ['foo', 'bar bar', 'baz']],
    ])(
      'should dispatch contentNotFound with invalid params (%s, %s)',
      (contentPrefix, fragments) => {
        const query = { contentPrefix, fragments }
        ContentPage.getInitialProps({ query, store: mockStore })
        expect(mockStore.dispatch).toBeCalledWith(contentNotFound())
      }
    )
  })
})
