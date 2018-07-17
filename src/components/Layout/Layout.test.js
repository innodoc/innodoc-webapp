import React from 'react'
import { shallow } from 'enzyme'

import { Layout } from './Layout'
import Main from './Main'
import Sidebar from './Sidebar'
import Header from './Header'
import Footer from './Footer'
import MessageModal from '../MessageModal'

describe('<Layout />', () => {
  const onMessageModalClosed = () => {}
  describe('default', () => {
    const wrapper = shallow(
      <Layout onMessageModalClosed={onMessageModalClosed}>
        <p>
          Funky!
        </p>
      </Layout>
    )
    it('should render children', () => {
      expect(wrapper.find('p').exists()).toBe(true)
    })
    it('should not have a sidebar by default', () => {
      expect(wrapper.find(Sidebar).exists()).toBe(false)
      expect(wrapper.find(Main).exists()).toBe(true)
    })
    it('should render header and footer', () => {
      expect(wrapper.find(Header).exists()).toBe(true)
      expect(wrapper.find(Footer).exists()).toBe(true)
    })
    it('should not show a message modal by default', () => {
      expect(wrapper.find(MessageModal).exists()).toBe(false)
    })
  })

  describe('with sidebar', () => {
    const wrapper = shallow(
      <Layout onMessageModalClosed={onMessageModalClosed} sidebar>
        <p>
          Funky!
        </p>
      </Layout>
    )
    it('should have a sidebar', () => {
      expect(wrapper.find(Sidebar).exists()).toBe(true)
    })
  })

  describe('with message', () => {
    const message = {
      title: 'Test message',
      msg: 'This is a test!',
      level: 'test',
    }
    const wrapper = shallow(
      <Layout onMessageModalClosed={onMessageModalClosed} message={message}>
        <p>
          Funky!
        </p>
      </Layout>
    )
    it('should show a message modal', () => {
      expect(wrapper.find(MessageModal).exists()).toBe(true)
    })
  })
})
