import React from 'react'
import { shallow } from 'enzyme'
import { Alert, Typography } from 'antd'

import { Trans } from '@innodoc/common/src/i18n'
import Messages, { Message } from './Messages'

jest.mock('@innodoc/common/src/i18n')

const messages = [
  { msg: 'messageKey', type: 'success' },
  { msg: 'messageKey', type: 'error' },
]

describe('<Messages />', () => {
  it('should render', () => {
    const wrapper = shallow(<Messages messages={messages} />)
    expect(wrapper.find(Message)).toHaveLength(2)
  })

  it('should render empty w/o messages', () => {
    const wrapper = shallow(<Messages messages={[]} />)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})

describe('<Message />', () => {
  it.each(messages)('should render (%s)', (message) => {
    const wrapper = shallow(<Message message={message} />)
    const alert = wrapper.find(Alert)
    expect(alert.prop('message')).toBe(`questions.feedback.${message.msg}`)
    expect(alert.prop('type')).toBe(message.type)
  })

  it('should render message with interpolation', () => {
    const message = {
      msg: 'messageKey',
      type: 'error',
      interp: { need: 'foo', got: 'bar' },
    }
    const wrapper = shallow(<Message message={message} />)
    const alert = wrapper.find(Alert)
    const ContentComp = () => alert.prop('message')
    const contentWrapper = shallow(<ContentComp />)
    const trans = contentWrapper.find(Trans)
    expect(trans.prop('i18nKey')).toBe(`questions.feedback.${message.msg}`)
    const texts = trans.find(Typography.Text)
    expect(texts).toHaveLength(2)
    expect(texts.at(0).prop('code')).toBe(true)
    expect(texts.at(0).prop('children').need).toBe('foo')
    expect(texts.at(1).prop('code')).toBe(true)
    expect(texts.at(1).prop('children').got).toBe('bar')
  })
})
