import React from 'react'
import { shallow } from 'enzyme'
import { Table as AntTable } from 'antd'

import Table from './Table'
import css from './ast.module.sss'

jest.mock('@innodoc/common/src/i18n')

const tableData = [
  ['', [], []],
  [
    null,
    [
      {
        t: 'Plain',
        c: [
          {
            t: 'Str',
            c: 'Caption',
          },
        ],
      },
    ],
  ],
  [
    [
      {
        t: 'AlignCenter',
      },
      {
        t: 'ColWidthDefault',
      },
    ],
    [
      {
        t: 'AlignRight',
      },
      {
        t: 'ColWidthDefault',
      },
    ],
    [
      {
        t: 'AlignLeft',
      },
      {
        t: 'ColWidthDefault',
      },
    ],
  ],
  [
    ['', [], []],
    [
      [
        ['', [], []],
        [
          [
            ['', [], []],
            {
              t: 'AlignDefault',
            },
            1,
            1,
            [
              {
                t: 'Plain',
                c: [
                  {
                    t: 'Str',
                    c: 'A',
                  },
                ],
              },
            ],
          ],
          [
            ['', [], []],
            {
              t: 'AlignDefault',
            },
            1,
            1,
            [
              {
                t: 'Plain',
                c: [
                  {
                    t: 'Str',
                    c: 'B',
                  },
                ],
              },
            ],
          ],
          [
            ['', [], []],
            {
              t: 'AlignDefault',
            },
            1,
            1,
            [
              {
                t: 'Plain',
                c: [
                  {
                    t: 'Str',
                    c: 'C',
                  },
                ],
              },
            ],
          ],
        ],
      ],
    ],
  ],
  [
    [
      ['', [], []],
      0,
      [],
      [
        [
          ['', [], []],
          [
            [
              ['', [], []],
              {
                t: 'AlignDefault',
              },
              1,
              1,
              [
                {
                  t: 'Plain',
                  c: [
                    {
                      t: 'Str',
                      c: 'A1',
                    },
                  ],
                },
              ],
            ],
            [
              ['', [], []],
              {
                t: 'AlignDefault',
              },
              1,
              1,
              [
                {
                  t: 'Plain',
                  c: [
                    {
                      t: 'Str',
                      c: 'B1',
                    },
                  ],
                },
              ],
            ],
            [
              ['', [], []],
              {
                t: 'AlignDefault',
              },
              1,
              1,
              [
                {
                  t: 'Plain',
                  c: [
                    {
                      t: 'Str',
                      c: 'C1',
                    },
                  ],
                },
              ],
            ],
          ],
        ],
        [
          ['', [], []],
          [
            [
              ['', [], []],
              {
                t: 'AlignDefault',
              },
              1,
              1,
              [
                {
                  t: 'Plain',
                  c: [
                    {
                      t: 'Str',
                      c: 'A2',
                    },
                  ],
                },
              ],
            ],
            [
              ['', [], []],
              {
                t: 'AlignDefault',
              },
              1,
              1,
              [
                {
                  t: 'Plain',
                  c: [
                    {
                      t: 'Str',
                      c: 'B2',
                    },
                  ],
                },
              ],
            ],
            [
              ['', [], []],
              {
                t: 'AlignDefault',
              },
              1,
              1,
              [
                {
                  t: 'Plain',
                  c: [
                    {
                      t: 'Str',
                      c: 'C2',
                    },
                  ],
                },
              ],
            ],
          ],
        ],
      ],
    ],
  ],
  [['', [], []], []],
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
    const caption = wrapper.children('div')
    expect(caption.hasClass(css.tableCaption)).toBe(true)
  })

  it('renders with caption', () => {
    const tableDataWithoutCaption = [...tableData]
    tableDataWithoutCaption[1][1] = []
    const wrapper = shallow(<Table data={tableDataWithoutCaption} />)
    expect(wrapper.exists('div')).toBe(false)
  })

  it('renders without header', () => {
    const tableDataWithoutHeader = [...tableData]
    tableDataWithoutHeader[3][1] = []
    const wrapper = shallow(<Table data={tableDataWithoutHeader} />)
    const antTable = wrapper.find(AntTable)
    expect(antTable).toHaveLength(1)
    expect(antTable.prop('showHeader')).toBe(false)
  })
})
