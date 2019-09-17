import React from 'react'
import { shallow } from 'enzyme'
import AntTable from 'antd/es/table'

import Table from './Table'

const tableData = [
  [],
  [
    { t: 'AlignCenter' },
    { t: 'AlignRight' },
    { t: 'AlignLeft' },
  ],
  [0, 0, 0],
  [
    [{
      t: 'Str',
      c: 'A',
    }],
    [{
      t: 'Str',
      c: 'B',
    }],
    [{
      t: 'Str',
      c: 'C',
    }],
  ],
  [
    [
      [{
        t: 'Str',
        c: 'A1',
      }],
      [{
        t: 'Str',
        c: 'B1',
      }],
      [{
        t: 'Str',
        c: 'C1',
      }],
    ],
    [
      [{
        t: 'Str',
        c: 'A2',
      }],
      [{
        t: 'Str',
        c: 'B2',
      }],
      [{
        t: 'Str',
        c: 'C2',
      }],
    ],
  ],
]

describe('<Table />', () => {
  it('renders', () => {
    const wrapper = shallow(<Table data={tableData} />)
    const antTable = wrapper.find(AntTable)
    expect(antTable).toHaveLength(1)
    expect(antTable.prop('showHeader')).toBe(true)
    const cols = antTable.prop('columns')
    expect(cols).toHaveLength(3)
    expect(cols[0].align).toBe('center')
    expect(cols[1].align).toBe('right')
    expect(cols[2].align).toBe('left')
    expect(antTable.prop('dataSource')).toHaveLength(2)
  })

  it('renders without header', () => {
    const tableDataWithoutHeader = [...tableData]
    tableDataWithoutHeader[3] = []
    const wrapper = shallow(<Table data={tableDataWithoutHeader} />)
    const antTable = wrapper.find(AntTable)
    expect(antTable).toHaveLength(1)
    expect(antTable.prop('showHeader')).toBe(false)
  })
})
