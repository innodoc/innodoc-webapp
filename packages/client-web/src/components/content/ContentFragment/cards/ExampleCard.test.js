import React from 'react'
import { shallow } from 'enzyme'
import { EyeOutlined } from '@ant-design/icons'

import Card from './Card'
import ExampleCard from './ExampleCard'

describe('<ExampleCard />', () => {
  it('renders', () => {
    const attrs = [['data-number', '1.2.3']]
    const content = []
    const wrapper = shallow(
      <ExampleCard attributes={attrs} content={content} id="foo-card" />
    )
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    expect(card.prop('cardType')).toBe('example')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('icon')).toEqual(<EyeOutlined />)
    expect(card.prop('id')).toBe('foo-card')
    expect(card.prop('title')).toBe('content.example 1.2.3')
  })
})
