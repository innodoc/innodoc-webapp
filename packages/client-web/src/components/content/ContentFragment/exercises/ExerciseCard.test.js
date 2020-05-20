import React from 'react'
import { shallow } from 'enzyme'
import { FormOutlined } from '@ant-design/icons'

import ExerciseCard from './ExerciseCard'
import { ExerciseProvider } from './ExerciseContext'
import Card from '../cards/Card'

describe('<ExerciseCard />', () => {
  it('should render', () => {
    const attrs = [['data-number', '1.1.1']]
    const content = [{ foo: 'foo' }]
    const wrapper = shallow(
      <ExerciseCard attributes={attrs} content={content} id="EX1" />
    )
    expect(wrapper.find(ExerciseProvider)).toHaveLength(1)
    const card = wrapper.find(Card)
    expect(card.prop('cardType')).toBe('exercise')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('icon')).toEqual(<FormOutlined />)
    expect(card.prop('id')).toBe('EX1')
    expect(card.prop('title')).toBe('content.exercise 1.1.1')
  })
})
