import React from 'react'
import { shallow } from 'enzyme'
import ContentFragment from '..'

import DefinitionList from './DefinitionList'

jest.mock('@innodoc/common/src/i18n')

const listData = [
  [[{ t: 'Str', c: 'Def 1' }], [[{ t: 'Str', c: 'Text 1' }]]],
  [[{ t: 'Str', c: 'Def 2' }], [[{ t: 'Str', c: 'Text 2' }]]],
]

describe('<DefinitionList />', () => {
  it('should render', () => {
    const wrapper = shallow(<DefinitionList data={listData} />)
    expect(wrapper.find('dl')).toHaveLength(1)
    const dt = wrapper.find('dt')
    expect(dt).toHaveLength(2)
    expect(dt.at(0).childAt(0).prop('content')).toBe(listData[0][0])
    expect(dt.at(1).childAt(0).prop('content')).toBe(listData[1][0])
    const dd = wrapper.find('dd')
    expect(dd).toHaveLength(2)
    expect(dd.at(0).childAt(0).prop('content')).toBe(listData[0][1][0])
    expect(dd.at(1).childAt(0).prop('content')).toBe(listData[1][1][0])
    expect(wrapper.find(ContentFragment)).toHaveLength(4)
  })
})
