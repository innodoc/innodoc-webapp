import React from 'react'
import { shallow } from 'enzyme'

import { CoursePage } from './page'
import Layout from '../components/Layout'
import Content from '../components/content/Content'
import ErrorPage from './_error'
import { loadSection, loadSectionFailure } from '../store/actions/content'

describe('<CoursePage />', () => {
  it('should render', () => {
    const wrapper = shallow(<CoursePage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).not.toBe(true)
    expect(layout.find(Content).exists()).toBe(true)
  })

  describe('getInitialProps', () => {
    it('should dispatch loadSection with sectionId', () => {
      const query = { sectionId: 'foo/bar' }
      const store = { dispatch: jest.fn() }
      CoursePage.getInitialProps({ query, store })
      expect(store.dispatch.mock.calls).toEqual([[loadSection('foo/bar')]])
    })

    it('should dispatch loadSectionFailure without sectionId', () => {
      const query = { }
      const store = { dispatch: jest.fn() }
      CoursePage.getInitialProps({ query, store })
      expect(store.dispatch.mock.calls).toEqual(
        [[loadSectionFailure({ error: { statusCode: 404 } })]])
    })
  })

  describe('handle 404 error', () => {
    it('should throw on a 404 (server)', () => {
      process.browser = false
      expect(() => {
        shallow(<CoursePage err={{ statusCode: 404 }} />)
      }).toThrow()
    })

    it('should render error on a 404 (client)', () => {
      process.browser = true
      const wrapper = shallow(<CoursePage err={{ statusCode: 404 }} />)
      expect(wrapper.find(ErrorPage).exists()).toBe(true)
      expect(wrapper.find(Layout).exists()).toBe(false)
    })
  })
})
