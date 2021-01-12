import React from 'react'
import { shallow } from 'enzyme'

import ActiveSectionLabel from './ActiveSectionLabel'

jest.mock('react-redux', () => ({
  useSelector: (selector) => selector(),
}))

let mockSection
jest.mock('@innodoc/client-store/src/selectors/section', () => ({
  makeGetSectionLink: () => () => mockSection,
}))

describe('ActiveSectionLabel', () => {
  it('should render', () => {
    mockSection = { title: 'Foo bar' }
    const wrapper = shallow(<ActiveSectionLabel sectionId="foo/bar" />)
    expect(wrapper.type()).toBe('span')
    expect(wrapper.text()).toBe('Foo bar')
  })

  it('should render (with short title)', () => {
    mockSection = { shortTitle: 'Foo', title: 'Foo bar' }
    const wrapper = shallow(<ActiveSectionLabel sectionId="foo/bar" />)
    expect(wrapper.type()).toBe('span')
    expect(wrapper.text()).toBe('Foo')
  })
})
