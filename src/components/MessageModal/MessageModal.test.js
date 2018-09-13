import React from 'react'
import { shallow } from 'enzyme'
import { Header, Modal } from 'semantic-ui-react'

import { MessageModal } from './MessageModal'

describe('<MessageModal />', () => {
  const msg = {
    level: 'info',
    title: 'Message title',
    msg: 'Hello message!',
  }
  const onClose = jest.fn()
  const wrapper = shallow(
    <MessageModal t={() => {}} onClose={onClose} message={msg} />
  )
  const modal = wrapper.find(Modal)

  it('should render message', () => {
    expect(wrapper.find(Header).at(1).prop('content')).toEqual(msg.title)
    expect(modal.exists()).toBe(true)
    expect(wrapper.find(Modal.Description).find('p').text()).toContain('Hello message!')
  })
})
