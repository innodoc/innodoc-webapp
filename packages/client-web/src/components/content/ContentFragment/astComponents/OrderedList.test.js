import React from 'react'
import { shallow } from 'enzyme'
import List from 'antd/lib/list'
import ContentFragment from '..'

import OrderedList from './OrderedList'

const listData = [
  [],
  [
    [{ t: 'Str', c: 'data 1' }],
    [{ t: 'Str', c: 'data 2' }],
    [{ t: 'Str', c: 'data 3' }],
  ],
]

describe('<OrderedList />', () => {
  it('should render', () => {
    const wrapper = shallow(<OrderedList data={listData} />)
    expect(wrapper.find(List)).toHaveLength(1)
    expect(wrapper.find(List.Item)).toHaveLength(3)
    expect(wrapper.find(ContentFragment)).toHaveLength(3)
  })
})
