import React from 'react'
import { shallow } from 'enzyme'
import { ArrowRightOutlined, ArrowLeftOutlined } from '@ant-design/icons'
import MathJax from '@innodoc/react-mathjax-node'

import ExerciseRouletteCard from './ExerciseRouletteCard'
import ExerciseCard from './ExerciseCard'

jest.mock('@innodoc/common/src/i18n')

jest.mock('./ExerciseCard', () => () => {})

const exercises = [
  {
    c: [['EX01', null, [['data-number', '1.1.1']]], [{ t: 'Str', c: 'foo' }]],
  },
  {
    c: [['EX02', null, [['data-number', '1.1.2']]], [{ t: 'Str', c: 'bar' }]],
  },
]

describe('<ExerciseRouletteCard />', () => {
  it('should render', () => {
    const wrapper = shallow(<ExerciseRouletteCard content={exercises} />)
    const mathJaxProvider = wrapper.find(MathJax.Provider)
    const card = mathJaxProvider.find(ExerciseCard)
    expect(card.prop('attributes')).toBe(exercises[0].c[0][2])
    expect(card.prop('content')).toBe(exercises[0].c[1])
    expect(card.prop('id')).toBe('EX01')

    const ExtraComp = () => card.prop('extra')
    const extraWrapper = shallow(<ExtraComp />)
    expect(extraWrapper.at(0).text()).toBe('content.exerciseRoulette.counter_1_2')

    const prevBtn = extraWrapper.at(1)
    expect(prevBtn.prop('disabled')).toBe(true)
    const IconPrevComp = () => prevBtn.prop('icon')
    expect(shallow(<IconPrevComp />).is(ArrowLeftOutlined)).toBe(true)
    expect(prevBtn.prop('title')).toBe('content.exerciseRoulette.prev')

    const nextBtn = extraWrapper.at(2)
    expect(nextBtn.prop('disabled')).toBe(false)
    const IconNextComp = () => nextBtn.prop('icon')
    expect(shallow(<IconNextComp />).is(ArrowRightOutlined)).toBe(true)
    expect(nextBtn.prop('title')).toBe('content.exerciseRoulette.next')
  })

  it('should allow switching exercises', () => {
    const wrapper = shallow(<ExerciseRouletteCard content={exercises} />)
    let card = wrapper.find(ExerciseCard)
    expect(card.prop('extra')[0].props.children).toBe('content.exerciseRoulette.counter_1_2')

    card.prop('extra')[2].props.onClick()
    card = wrapper.find(ExerciseCard)
    expect(card.prop('extra')[0].props.children).toBe('content.exerciseRoulette.counter_2_2')
    expect(card.prop('extra')[1].props.disabled).toBe(false)
    expect(card.prop('extra')[2].props.disabled).toBe(true)

    card.prop('extra')[1].props.onClick()
    card = wrapper.find(ExerciseCard)
    expect(card.prop('extra')[0].props.children).toBe('content.exerciseRoulette.counter_1_2')
    expect(card.prop('extra')[1].props.disabled).toBe(true)
    expect(card.prop('extra')[2].props.disabled).toBe(false)
  })
})
