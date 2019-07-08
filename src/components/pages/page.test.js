import React from 'react'
import { shallow } from 'enzyme'

import CoursePage from './page'
import ErrorPage from './error'
import Layout from '../Layout'
import Content from '../content/Content'
import { loadSection, loadSectionFailure } from '../../store/actions/content'

let mockApp
jest.mock('react-redux', () => ({ useSelector: () => mockApp }))
jest.mock('../../store/selectors', () => ({
  getApp: () => mockApp,
  getOrmState: () => {},
}))

describe('<CoursePage />', () => {
  beforeEach(() => { mockApp = { language: 'en' } })

  it('should render', () => {
    const wrapper = shallow(<CoursePage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).not.toBe(true)
    expect(layout.find(Content).exists()).toBe(true)
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
      const query = { sectionId: 'foo/bar' }
      CoursePage.getInitialProps({ query, store })
      expect(store.dispatch).toBeCalledWith(loadSection('foo/bar', 'en'))
    })

    it('should dispatch loadSectionFailure without sectionId', () => {
      const query = {}
      CoursePage.getInitialProps({ query, store })
      expect(store.dispatch).toBeCalledWith(
        loadSectionFailure({ error: { statusCode: 404 } })
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
        shallow(<CoursePage />)
      }).toThrow()
    })

    it('should render error on a 404 (client)', () => {
      process.browser = true
      const wrapper = shallow(<CoursePage />)
      expect(wrapper.find(ErrorPage).exists()).toBe(true)
      expect(wrapper.find(Layout).exists()).toBe(false)
    })
  })
})
