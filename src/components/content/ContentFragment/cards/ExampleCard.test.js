import React from 'react'
import { shallow } from 'enzyme'

import Card from './Card'
import ExampleCard from './ExampleCard'

describe('<ExampleCard />', () => {
  it('renders', () => {
    const content = []
    const wrapper = shallow(<ExampleCard content={content} id="foo-card" />)
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    expect(card.prop('cardType')).toBe('example')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('id')).toBe('foo-card')
  })
})
