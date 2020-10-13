import React from 'react'
import { mount } from 'enzyme'
import { Button } from 'antd'

import ContentFragment from '../..'
import { ExerciseContext } from '../ExerciseContext'
import VerifyInfoButton from './VerifyInfoButton'

jest.mock('@innodoc/common/src/i18n')

const content = [{ t: '', c: [] }]

const getWrapper = (val) => {
  const contextVal = {
    answered: true,
    setAutoVerify: () => {},
    setUserTriggeredVerify: () => {},
    userTriggeredVerify: false,
    ...val,
  }
  return mount(
    <ExerciseContext.Provider value={contextVal}>
      <VerifyInfoButton content={content} />
    </ExerciseContext.Provider>
  )
}

describe('<VerifyInfoButton />', () => {
  it('should render', () => {
    const wrapper = getWrapper()
    expect(wrapper.exists(Button)).toBe(true)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment.prop('content')).toBe(content)
  })

  it('should setAutoVerify(false)', () => {
    const setAutoVerify = jest.fn()
    getWrapper({ setAutoVerify })
    expect(setAutoVerify).toBeCalledWith(false)
  })

  it('should trigger verify on click', () => {
    const setUserTriggeredVerify = jest.fn()
    const wrapper = getWrapper({ setUserTriggeredVerify })
    expect(setUserTriggeredVerify).not.toBeCalled()
    wrapper.find(Button).invoke('onClick')()
    expect(setUserTriggeredVerify).toBeCalledWith(true)
  })

  describe('disabled', () => {
    it('should be enabled with answered exercise and verify untriggered', () => {
      const wrapper = getWrapper()
      expect(wrapper.find(Button).prop('disabled')).toBe(false)
    })

    it('should be disabled with unanswered exercise', () => {
      const wrapper = getWrapper({ answered: false })
      expect(wrapper.find(Button).prop('disabled')).toBe(true)
    })

    it('should be disabled with verify triggered', () => {
      const wrapper = getWrapper({ userTriggeredVerify: true })
      expect(wrapper.find(Button).prop('disabled')).toBe(true)
    })
  })
})
