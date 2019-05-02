import React from 'react'
import { shallow } from 'enzyme'

import { ExerciseCard } from './ExerciseCard'
import ExerciseProvider from './ExerciseProvider'
import Card from '../Card'

describe('<ExerciseCard />', () => {
  it('should render', () => {
    const content = [{ foo: 'foo' }]
    const wrapper = shallow(
      <ExerciseCard content={content} id="EX1" t={() => ''} />
    )
    expect(wrapper.find(ExerciseProvider)).toHaveLength(1)
    const card = wrapper.find(Card)
    expect(card.prop('cardType')).toBe('exercise')
    expect(card.prop('icon')).toBe('form')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('id')).toBe('EX1')
  })
})
