import React from 'react'
import { shallow } from 'enzyme'

import ContentFragment from '../ContentFragment'
import InputHint from '../cards/InputHint'
import Question from '../questions'
import Span, { IndexSpan } from './Span'

const content = [{ content: 'foo' }]

describe('<IndexSpan />', () => {
  it('should render', () => {
    const wrapper = shallow(<IndexSpan indexConcept="foo" content={content} />)
    expect(wrapper.hasClass('index-concept')).toBe(true)
    expect(wrapper.prop('data-index-concept')).toBe('foo')
    expect(wrapper.find(ContentFragment).prop('content')).toBe(content)
  })
})

describe('<Span />', () => {
  it('should render <IndexSpan />', () => {
    const data = [[null, [], [['data-index-concept', 'some-concept']]], content]
    const indexSpan = shallow(<Span data={data} />).find(IndexSpan)
    expect(indexSpan.prop('indexConcept')).toBe('some-concept')
    expect(indexSpan.prop('content')).toBe(content)
  })

  it('should not render an empty span', () => {
    const data = [[null, [], []], []]
    expect(shallow(<Span data={data} />).get(0)).toBeNull()
  })

  it('should unwrap useless wrapper span', () => {
    const data = [[null, [], []], content]
    const wrapper = shallow(<Span data={data} />)
    expect(wrapper.type()).toBe(ContentFragment)
    expect(wrapper.prop('content')).toBe(content)
  })

  it('should render <InputHint />', () => {
    const data = [[null, ['hint-text'], []], content]
    const wrapper = shallow(<Span data={data} />)
    expect(wrapper.type()).toBe(InputHint)
  })

  it('should render <Question />', () => {
    const data = [['foo', ['question', 'foo-question'], [['key', 'val']]], content]
    const wrapper = shallow(<Span data={data} />)
    expect(wrapper.type()).toBe(Question)
    expect(wrapper.prop('id')).toBe('foo')
    expect(wrapper.prop('questionClasses')).toEqual(['foo-question'])
    expect(wrapper.prop('attributes')).toEqual([['key', 'val']])
  })

  describe('unknown span', () => {
    it('should render debug component for unknown span', () => {
      const data = [[null, ['does-not-exist'], []], content]
      expect(shallow(<Span data={data} />).text()).toMatch('Unknown span')
    })

    it('should not render unknown span in production', () => {
      process.env.NODE_ENV = 'production'
      const data = [[null, ['does-not-exist'], []], content]
      expect(shallow(<Span data={data} />).get(0)).toBeNull()
    })
  })
})
