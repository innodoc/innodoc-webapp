import React from 'react'
import { shallow } from 'enzyme'

import { Layout } from './Layout'
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
    it('should render header and footer', () => {
      expect(wrapper.find(Sidebar).exists()).toBe(true)
      expect(wrapper.find(Header).exists()).toBe(true)
      expect(wrapper.find(Footer).exists()).toBe(true)
    })
    it('should not show a message modal by default', () => {
      expect(wrapper.find(MessageModal).exists()).toBe(false)
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
