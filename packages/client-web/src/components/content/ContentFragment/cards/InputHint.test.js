import React from 'react'
import { shallow } from 'enzyme'
import Icon from '@ant-design/icons'

import KeyboardSvg from '@fortawesome/fontawesome-free/svgs/regular/keyboard.svg'
import Card from './Card'
import InputHint from './InputHint'

// @svgr/webpack does not work inside tests
jest.mock('@fortawesome/fontawesome-free/svgs/regular/keyboard.svg', () => () => null)

describe('<InputHint />', () => {
  it('renders', () => {
    const content = []
    const wrapper = shallow(<InputHint content={content} id="foo-card" />)
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    expect(card.prop('cardType')).toBe('inputHint')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('icon')).toEqual(<Icon component={KeyboardSvg} />)
    expect(card.prop('id')).toBe('foo-card')
  })
})
