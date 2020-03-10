import React from 'react'
import { shallow } from 'enzyme'
import { Modal, Result } from 'antd'

import MessageModal from './MessageModal'

const mockT = jest.fn()
jest.mock('@innodoc/client-misc/src/i18n', () => ({
  useTranslation: jest.fn(() => ({ t: mockT })),
}))

describe('<MessageModal />', () => {
  let msg

  beforeEach(() => {
    jest.clearAllMocks()
    msg = {
      closable: true,
      level: 'info',
      text: 'Test text',
      type: 'loadManifestFailure',
    }
  })

  it('should render', () => {
    const wrapper = shallow(<MessageModal message={msg} />)
    expect(wrapper.find(Modal).exists()).toBe(true)
    expect(wrapper.find(Result).prop('status')).toBe('info')
  })

  it('should use level and type for translations', () => {
    shallow(<MessageModal message={msg} />)
    expect(mockT).toBeCalledWith('userMessage.levels.info')
    expect(mockT).toBeCalledWith('userMessage.types.loadManifestFailure.text')
    expect(mockT).toBeCalledWith('userMessage.types.loadManifestFailure.title')
  })

  it.each([true, false])('should handle closable=%s', (closable) => {
    msg.closable = closable
    const wrapper = shallow(<MessageModal message={msg} />)
    const modal = wrapper.find(Modal)
    expect(modal.prop('closable')).toBe(closable)
    if (closable) {
      expect(modal.prop('footer')).toBeTruthy()
    } else {
      expect(modal.prop('footer')).toBeFalsy()
    }
  })

  it('should pass onClose', () => {
    const onClose = () => {}
    const wrapper = shallow(<MessageModal message={msg} onClose={onClose} />)
    expect(wrapper.find(Modal).prop('onCancel')).toBe(onClose)
  })
})
