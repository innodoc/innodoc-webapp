import React from 'react'
import { shallow } from 'enzyme'
import { InfoCircleOutlined } from '@ant-design/icons'

import Card from './Card'
import InfoCard from './InfoCard'

jest.mock('@innodoc/common/src/i18n')

describe('<InfoCard />', () => {
  it('renders', () => {
    const attrs = [['data-number', '2.1.16']]
    const content = []
    const wrapper = shallow(<InfoCard attributes={attrs} content={content} id="foo-card" />)
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    expect(card.prop('cardType')).toBe('info')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('icon')).toEqual(<InfoCircleOutlined />)
    expect(card.prop('id')).toBe('foo-card')
    expect(card.prop('title')).toBe('content.info 2.1.16')
  })
})
