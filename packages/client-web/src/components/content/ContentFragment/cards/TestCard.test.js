import React from 'react'
import { shallow } from 'enzyme'
import { EditOutlined } from '@ant-design/icons'

import Card from './Card'
import TestCard from './TestCard'

describe('<TestCard />', () => {
  it('renders', () => {
    const content = []
    const wrapper = shallow(<TestCard content={content} id="foo-card" />)
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    expect(card.prop('cardType')).toBe('test')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('icon')).toEqual(<EditOutlined />)
    expect(card.prop('id')).toBe('foo-card')
  })
})
