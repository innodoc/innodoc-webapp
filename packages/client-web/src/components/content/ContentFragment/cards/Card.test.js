import React from 'react'
import { mount } from 'enzyme'
import { Card as AntCard } from 'antd'
import { FileOutlined } from '@ant-design/icons'

import Card from './Card'
import ContentFragment from '..'

jest.mock('@innodoc/common/src/i18n')

describe('<Card />', () => {
  it('renders', () => {
    const content = [{ t: 'Str', c: 'Bar' }]
    const wrapper = mount(
      <Card
        cardType="info"
        content={content}
        extra={['extra']}
        icon={<FileOutlined />}
        id="foo-id"
        title="foo"
      />
    )
    const antCard = wrapper.find(AntCard)
    expect(antCard).toHaveLength(1)
    expect(antCard.prop('extra')[0]).toBe('extra')
    expect(antCard.prop('id')).toBe('foo-id')
    expect(wrapper.find(ContentFragment)).toHaveLength(1)
    const icon = antCard.find(FileOutlined)
    expect(icon).toHaveLength(1)
  })

  it('renders with actions', () => {
    const actions = ['ACTION_A', 'ACTION_B']
    const wrapper = mount(<Card actions={actions} cardType="info" content={[]} title="foo" />)
    expect(wrapper.find(AntCard).prop('actions')).toBe(actions)
  })
})
