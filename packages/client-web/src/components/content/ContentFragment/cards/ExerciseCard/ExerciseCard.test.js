import React from 'react'
import { shallow } from 'enzyme'
import { FormOutlined } from '@ant-design/icons'

import ExerciseCard from './ExerciseCard'
import ExerciseProvider from './ExerciseProvider'
import Card from '../Card'

describe('<ExerciseCard />', () => {
  it('should render', () => {
    const content = [{ foo: 'foo' }]
    const wrapper = shallow(<ExerciseCard content={content} id="EX1" />)
    expect(wrapper.find(ExerciseProvider)).toHaveLength(1)
    const card = wrapper.find(Card)
    expect(card.prop('cardType')).toBe('exercise')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('icon')).toEqual(<FormOutlined />)
    expect(card.prop('id')).toBe('EX1')
  })
})
