import React from 'react'
import { shallow } from 'enzyme'

import Card from './Card'
import InfoCard from './InfoCard'

describe('<InfoCard />', () => {
  it('renders', () => {
    const content = []
    const wrapper = shallow(<InfoCard content={content} id="foo-card" />)
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    expect(card.prop('cardType')).toBe('info')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('id')).toBe('foo-card')
  })
})
