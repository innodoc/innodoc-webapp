import React from 'react'
import { shallow } from 'enzyme'
import { Modal } from 'antd'
import { InfoOutlined, WarningOutlined } from '@ant-design/icons'

import MessageModal from './MessageModal'

describe('<MessageModal />', () => {
  it.each([
    [
      'info',
      {
        level: 'info',
        title: 'Message title',
        msg: 'Hello message!',
      },
      InfoOutlined,
    ],
    [
      'error',
      {
        level: 'error',
        title: 'Message title',
        msg: 'Error message!',
      },
      WarningOutlined,
    ],
    [
      'fatal',
      {
        level: 'fatal',
        title: 'Message title',
        msg: 'Fatal message!',
      },
      WarningOutlined,
    ],
  ])('should render %s', (type, msg, Icon) => {
    const onClose = jest.fn()
    const wrapper = shallow(<MessageModal onClose={onClose} message={msg} />)
    const modal = wrapper.find(Modal)
    expect(modal.exists()).toBe(true)
    expect(wrapper.find('h4').text()).toEqual(msg.title)
    expect(modal.find('p').text()).toContain(msg.msg)
    expect(modal.exists(Icon)).toBe(true)
  })
})
