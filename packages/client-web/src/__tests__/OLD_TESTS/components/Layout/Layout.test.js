import React from 'react'
import { mount, shallow } from 'enzyme'
import cookies from 'react-cookies'

import appSelectors from '@innodoc/client-store/src/selectors'

import DataProtectionModal from './DataProtectionModal'
import Footer from './Footer'
import Header from './Header'
import Layout from './Layout'
import MessageModal from './MessageModal'
import Sidebar from './Sidebar'

jest.mock('@innodoc/common/src/i18n')

let mockLoggedInEmail
let mockLatestMessage
const mockDispatch = jest.fn()
const mockAppSelectors = appSelectors
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (selector) =>
    selector === mockAppSelectors.getApp ? { loggedInEmail: mockLoggedInEmail } : mockLatestMessage,
}))

let mockCookieVal
jest.mock('react-cookies', () => ({
  load: () => mockCookieVal,
  save: jest.fn(),
}))

jest.mock('./DataProtectionModal', () => () => null)
jest.mock('./Footer', () => () => null)
jest.mock('../Toc', () => () => null)
jest.mock('./Sidebar', () => () => null)
jest.mock('./Header', () => () => null)

describe('<Layout />', () => {
  beforeEach(() => {
    mockLatestMessage = undefined
    mockLoggedInEmail = 'alice@example.com'
  })

  describe('default', () => {
    let wrapper
    beforeEach(() => {
      wrapper = shallow(
        <Layout>
          <p>Funky!</p>
        </Layout>
      )
    })

    it('should render children', () => {
      expect(wrapper.find('p').text()).toBe('Funky!')
    })

    it('should render header and footer', () => {
      expect(wrapper.find(Sidebar).exists()).toBe(true)
      expect(wrapper.find(Header).exists()).toBe(true)
      expect(wrapper.find(Footer).exists()).toBe(true)
    })

    it('should not render a message modal by default', () => {
      expect(wrapper.find(MessageModal).exists()).toBe(false)
    })
  })

  describe('data protection modal', () => {
    beforeEach(() => {
      mockLoggedInEmail = undefined
      mockCookieVal = undefined
    })

    it('should show modal on first view', () => {
      const wrapper = mount(
        <Layout>
          <div />
        </Layout>
      )
      expect(wrapper.exists(DataProtectionModal)).toBe(true)
    })

    it('should not show modal if logged in', () => {
      mockLoggedInEmail = 'alice@example.com'
      const wrapper = mount(
        <Layout>
          <div />
        </Layout>
      )
      expect(wrapper.exists(DataProtectionModal)).toBe(false)
    })

    it('should not show modal if consent cookie is present', () => {
      mockCookieVal = true
      const wrapper = mount(
        <Layout>
          <div />
        </Layout>
      )
      expect(wrapper.exists(DataProtectionModal)).toBe(false)
    })

    it('should save cookie and close modal if consent is given', () => {
      const wrapper = mount(
        <Layout>
          <div />
        </Layout>
      )
      const modal = wrapper.find(DataProtectionModal)
      modal.invoke('onAccept')()
      expect(cookies.save).toBeCalledTimes(1)
      expect(wrapper.exists(DataProtectionModal)).toBe(false)
    })
  })

  describe('message modal', () => {
    beforeEach(() => {
      mockDispatch.mockClear()
      mockLatestMessage = {
        closable: false,
        level: 'error',
        text: 'Error message',
        type: 'loadManifestFailure',
      }
    })

    it('should show a message modal', () => {
      const wrapper = shallow(
        <Layout>
          <div />
        </Layout>
      )
      expect(wrapper.find(MessageModal).prop('message')).toBe(mockLatestMessage)
    })

    it('should dispatch clearMessage on modal close', () => {
      const wrapper = shallow(
        <Layout>
          <div />
        </Layout>
      )
      wrapper.find(MessageModal).prop('onClose')()
      expect(mockDispatch.mock.calls).toHaveLength(1)
    })
  })
})
