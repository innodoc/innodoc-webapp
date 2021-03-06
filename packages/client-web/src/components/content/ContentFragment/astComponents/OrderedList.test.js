import React from 'react'
import { shallow } from 'enzyme'
import ContentFragment from '..'

import OrderedList from './OrderedList'

jest.mock('@innodoc/common/src/i18n')

const listData = [
  [],
  [[{ t: 'Str', c: 'data 1' }], [{ t: 'Str', c: 'data 2' }], [{ t: 'Str', c: 'data 3' }]],
]

describe('<OrderedList />', () => {
  it('should render', () => {
    const wrapper = shallow(<OrderedList data={listData} />)
    expect(wrapper.find('ol')).toHaveLength(1)
    expect(wrapper.find('li')).toHaveLength(3)
    expect(wrapper.find(ContentFragment)).toHaveLength(3)
  })
})
