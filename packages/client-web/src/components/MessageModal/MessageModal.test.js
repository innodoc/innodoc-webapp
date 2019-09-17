import React from 'react'
import { shallow } from 'enzyme'
import { Icon, Modal } from 'antd'

import MessageModal from './MessageModal'

describe('<MessageModal />', () => {
  it('should render', () => {
    const msg = {
      level: 'info',
      title: 'Message title',
      msg: 'Hello message!',
    }
    const onClose = jest.fn()
    const wrapper = shallow(
      <MessageModal onClose={onClose} message={msg} />
    )
    const modal = wrapper.find(Modal)
    expect(modal.exists()).toBe(true)
    expect(wrapper.find('h4').text()).toEqual(msg.title)
    expect(modal.find('p').text()).toContain('Hello message!')
    const icon = modal.find(Icon)
    expect(icon.prop('type')).toBe('info')
  })
})
