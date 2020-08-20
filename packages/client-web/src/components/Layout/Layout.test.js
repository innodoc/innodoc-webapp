import React from 'react'
import { shallow } from 'enzyme'

import Layout from './Layout'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import MessageModal from './MessageModal'

// TODO update

let mockLatestMessage
const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockLatestMessage,
}))

describe('<Layout />', () => {
  beforeEach(() => {
    mockLatestMessage = undefined
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

  describe('with message', () => {
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
