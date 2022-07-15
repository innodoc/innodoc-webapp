import React from 'react'
import { shallow } from 'enzyme'
import { Col as AntdCol, Row as AntdRow } from 'antd'

import Row from './Row'
import ContentFragment from '../ContentFragment'

jest.mock('@innodoc/common/src/i18n')

describe('<Row />', () => {
  it('should render', () => {
    const attributes = [
      ['align', 'middle'],
      ['gutter', '16'],
    ]
    const attrsCol1 = [['span', '24']]
    const contentCol1 = []
    const attrsCol2 = [
      ['xs', '24'],
      ['sm', '16'],
      ['md', '12'],
      ['lg', '8'],
      ['xl', '6'],
    ]
    const contentCol2 = []
    const content = [
      { t: 'Div', c: [[null, ['col'], attrsCol1], contentCol1] },
      { t: 'Div', c: [[null, ['col'], attrsCol2], contentCol2] },
    ]
    const wrapper = shallow(<Row attributes={attributes} content={content} />)
    const row = wrapper.find(AntdRow)
    expect(row).toHaveLength(1)
    expect(row.prop('align')).toBe('middle')
    expect(row.prop('gutter')).toBe(16)
    const cols = wrapper.find(AntdCol)
    expect(cols).toHaveLength(2)
    const col1 = cols.at(0)
    expect(col1.prop('span')).toBe(24)
    expect(col1.find(ContentFragment).prop('content')).toBe(contentCol1)
    const col2 = cols.at(1)
    expect(col2.prop('xs')).toBe(24)
    expect(col2.prop('sm')).toBe(16)
    expect(col2.prop('md')).toBe(12)
    expect(col2.prop('lg')).toBe(8)
    expect(col2.prop('xl')).toBe(6)
    expect(col2.find(ContentFragment).prop('content')).toBe(contentCol2)
  })
})
