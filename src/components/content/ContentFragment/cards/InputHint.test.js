import React from 'react'
import { shallow } from 'enzyme'

import Card from './Card'
import InputHint from './InputHint'

describe('<InputHint />', () => {
  it('renders', () => {
    const content = []
    const wrapper = shallow(<InputHint content={content} id="foo-card" />)
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    expect(card.prop('cardType')).toBe('inputHint')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('id')).toBe('foo-card')
  })
})
