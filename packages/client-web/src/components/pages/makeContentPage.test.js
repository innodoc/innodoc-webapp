import React from 'react'
import { shallow } from 'enzyme'

import makeContentPage from './makeContentPage'
import ErrorPage from './ErrorPage'
import Layout from '../Layout'

let mockApp
jest.mock('react-redux', () => ({ useSelector: () => mockApp }))
jest.mock('@innodoc/client-store/src/selectors', () => ({
  getApp: () => mockApp,
  makeMakeGetContentLink: () => {},
  selectId: () => {},
}))
const ContentComponent = () => 'Content'
let ContentPage
const loadContent = () => ({ action: 'mockLoadContent' })
const loadContentFailure = () => ({ action: 'mockLoadContentFailure' })

describe('makeContentPage', () => {
  beforeEach(() => {
    mockApp = { language: 'en' }
    ContentPage = makeContentPage(
      ContentComponent,
      loadContent,
      loadContentFailure
    )
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

    it('should dispatch loadSectionFailure without sectionId', () => {
      const query = {}
      ContentPage.getInitialProps({ query, store })
      expect(store.dispatch).toBeCalledWith(
        loadContentFailure({ error: { statusCode: 404 } })
      )
    })
  })

  describe('handle 404 error', () => {
    beforeEach(() => {
      mockApp = { error: { statusCode: 404 } }
    })

    it('should throw on a 404 (server)', () => {
      process.browser = false
      expect(() => {
        shallow(<ContentPage />)
      }).toThrow()
    })

    it('should render error on a 404 (client)', () => {
      process.browser = true
      const wrapper = shallow(<ContentPage />)
      expect(wrapper.find(ErrorPage).exists()).toBe(true)
      expect(wrapper.find(Layout).exists()).toBe(false)
    })
  })
})
