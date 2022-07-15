import React from 'react'
import { shallow } from 'enzyme'
import NextLink from 'next/link'

import Link from './Link'

describe('<InnoDocDocument />', () => {
  it('should render', () => {
    const wrapper = shallow(<Link href="/foo">title</Link>)
    expect(wrapper.find(NextLink).prop('href')).toBe('/foo')
    expect(wrapper.find('a').prop('children')).toBe('title')
  })
})
