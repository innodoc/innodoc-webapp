import React from 'react'
import { mount } from 'enzyme'
import AntCard from 'antd/es/card'
import Icon from 'antd/es/icon'

import Card from './Card'
import ContentFragment from '..'

describe('<Card />', () => {
  it('renders', () => {
    const content = [{ t: 'Str', c: 'Bar' }]
    const wrapper = mount(
      <Card
        title="foo"
        icon="file"
        cardType="info"
        content={content}
        id="foo-id"
      />
    )
    const antCard = wrapper.find(AntCard)
    expect(antCard).toHaveLength(1)
    expect(antCard.prop('id')).toBe('foo-id')
    expect(wrapper.find(ContentFragment)).toHaveLength(1)
    const icon = antCard.find(Icon)
    expect(icon).toHaveLength(1)
    expect(icon.prop('type')).toBe('file')
  })
})
