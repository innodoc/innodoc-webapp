import React from 'react'
import { shallow } from 'enzyme'

import ActiveSectionLabel from './ActiveSectionLabel'

jest.mock('react-redux', () => ({
  useSelector: (selector) => selector(),
}))

jest.mock('@innodoc/client-store/src/selectors/section', () => ({
  makeGetSectionLink: () => () => ({
    title: 'Foo bar',
  }),
}))

describe('ActiveSectionLabel', () => {
  it('should render', () => {
    const wrapper = shallow(<ActiveSectionLabel sectionId="foo/bar" />)
    expect(wrapper.type()).toBe('span')
    expect(wrapper.text()).toBe('Foo bar')
  })
})
