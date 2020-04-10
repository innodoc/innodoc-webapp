import React from 'react'
import { shallow } from 'enzyme'

import { contentNotFound } from '@innodoc/client-store/src/actions/content'
import makeContentPage from './makeContentPage'
import ErrorPage from './ErrorPage'
import Layout from '../Layout'

let mockApp
jest.mock('react-redux', () => ({ useSelector: () => mockApp }))
let mockServerContext
jest.mock('next-server-context', () => ({
  useServerContext: () => mockServerContext,
}))
jest.mock('@innodoc/client-store/src/selectors', () => ({
  getApp: () => mockApp,
  makeMakeGetContentLink: () => {},
  selectId: () => {},
}))

describe('makeContentPage', () => {
  const ContentComponent = () => 'Content'
  const loadContent = () => ({ action: 'mockLoadContent' })
  let ContentPage

  beforeEach(() => {
    mockApp = { language: 'en' }
    mockServerContext = { response: {} }
    ContentPage = makeContentPage(ContentComponent, loadContent)
  })

  it('should render', () => {
    const wrapper = shallow(<ContentPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).not.toBe(true)
    expect(layout.find(ContentComponent).exists()).toBe(true)
  })

  describe('getInitialProps', () => {
    let store
    beforeEach(() => {
      store = {
        dispatch: jest.fn(),
        getState: () => {},
      }
    })

    it('should dispatch loadSection with sectionId', () => {
      const query = { contentId: 'foo/bar' }
      ContentPage.getInitialProps({ query, store })
      expect(store.dispatch).toBeCalledWith(loadContent('foo/bar', 'en'))
    })

    it('should dispatch contentNotFound without sectionId', () => {
      const query = {}
      ContentPage.getInitialProps({ query, store })
      expect(store.dispatch).toBeCalledWith(contentNotFound())
    })
  })

  it('should show error page for 404', () => {
    mockApp = { show404: true }
    const wrapper = shallow(<ContentPage />)
    expect(wrapper.find(ErrorPage).prop('statusCode')).toBe(404)
    expect(wrapper.find(Layout).exists()).toBe(false)
  })

  it('should set status code to 404 in server context', () => {
    mockApp = { show404: true }
    shallow(<ContentPage />)
    expect(mockServerContext.response.statusCode).toBe(404)
  })
})
