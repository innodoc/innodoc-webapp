import React from 'react'
import { shallow } from 'enzyme'
import { Popover } from 'antd'

import MathJaxPreview from './MathJaxPreview'
import Messages from './Messages'
import InputPopover from './InputPopover'
import css from './style.sss'

jest.mock('@innodoc/common/src/i18n')

const messages = [{ msg: 'messageKey', type: 'success' }]

let mockLg
jest.mock('antd', () => ({
  Grid: { useBreakpoint: () => ({ lg: mockLg }) },
  Popover: jest.requireActual('antd').Popover,
}))

describe('<InputPopover />', () => {
  beforeEach(() => {
    mockLg = true
  })

  it('should render', () => {
    const wrapper = shallow(
      <InputPopover focus messages={messages} showPreview={false} userInput="Foo">
        <div>Test</div>
      </InputPopover>
    )
    expect(wrapper.find('div')).toHaveLength(1)
    const popover = wrapper.find(Popover)
    expect(popover.prop('visible')).toBe(true)
    const Content = () => popover.prop('content')
    const contentWrapper = shallow(<Content />)
    expect(contentWrapper.exists(`div.${css.mathJaxPreview}`)).toBe(false)
    const messagesComponent = contentWrapper.find(Messages)
    expect(messagesComponent.prop('messages')).toBe(messages)
  })

  it('should not be visible w/o focus', () => {
    const wrapper = shallow(
      <InputPopover focus={false} messages={messages} showPreview={false} userInput="Foo">
        <div>Test</div>
      </InputPopover>
    )
    expect(wrapper.find(Popover).prop('visible')).toBe(false)
  })

  it('should not be visible with empty userInput and no messages', () => {
    const wrapper = shallow(
      <InputPopover focus showPreview={false} userInput="">
        <div>Test</div>
      </InputPopover>
    )
    expect(wrapper.find(Popover).prop('visible')).toBe(false)
  })

  it('should show MathJax preview', () => {
    const wrapper = shallow(
      <InputPopover focus messages={messages} showPreview userInput="Foo">
        <div>Test</div>
      </InputPopover>
    )
    const Content = () => wrapper.find(Popover).prop('content')
    const contentWrapper = shallow(<Content />)
    expect(contentWrapper.find(MathJaxPreview).prop('texCode')).toBe('Foo')
  })

  describe('placement', () => {
    it.each([
      ['rightTop', true],
      ['bottom', false],
    ])('should place %s with lg=%s', (placement, lg) => {
      mockLg = lg
      const wrapper = shallow(
        <InputPopover focus showPreview={false} userInput="Foo">
          <div>Test</div>
        </InputPopover>
      )
      expect(wrapper.find(Popover).prop('placement')).toBe(placement)
    })
  })
})
