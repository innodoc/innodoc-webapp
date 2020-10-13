import React from 'react'
import { mount } from 'enzyme'
import { Button, Collapse, Modal, Switch } from 'antd'

import DataProtectionModal from './DataProtectionModal'
import LanguageSwitcher from './LanguageSwitcher'

jest.mock('@innodoc/common/src/i18n')

jest.mock('./LanguageSwitcher', () => () => null)

describe('<DataProtectionModal />', () => {
  it('should render', () => {
    const wrapper = mount(<DataProtectionModal onAccept={() => {}} />)
    const modal = wrapper.find(Modal)
    expect(modal.prop('closable')).toBe(false)
    expect(modal.find(Switch)).toHaveLength(2)
    expect(modal.find(Collapse.Panel)).toHaveLength(2)
    expect(modal.find(LanguageSwitcher)).toHaveLength(1)
  })

  describe('should only be allowed to confirm once both switches are flicked', () => {
    test.each([
      [true, true, true],
      [false, false, false],
      [false, false, true],
      [false, true, false],
    ])('OK button enabled=%s for switch1=%s switch2=%s', (okEnabled, sw1, sw2) => {
      const onAccept = jest.fn()
      const wrapper = mount(<DataProtectionModal onAccept={onAccept} />)
      const switches = wrapper.find(Switch)
      if (sw1) {
        switches.at(0).simulate('click')
      }
      if (sw2) {
        switches.at(1).simulate('click')
      }
      wrapper.find(Button).simulate('click')
      if (okEnabled) {
        expect(onAccept).toBeCalled()
      } else {
        expect(onAccept).not.toBeCalled()
      }
    })
  })
})
