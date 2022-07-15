import React from 'react'
import { shallow } from 'enzyme'

import Quoted from './Quoted'
import ContentFragment from '..'

jest.mock('@innodoc/common/src/i18n')

describe('<Quoted />', () => {
  it('renders', () => {
    const data = [
      null,
      [
        {
          t: 'Str',
          c: 'Foo bar',
        },
      ],
    ]
    const wrapper = shallow(<Quoted data={data} />)
    const text = wrapper.text()
    expect(text.startsWith('“')).toBe(true)
    expect(text.endsWith('”')).toBe(true)
    expect(wrapper.find(ContentFragment)).toHaveLength(1)
  })
})
