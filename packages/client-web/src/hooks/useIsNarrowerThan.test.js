import React from 'react'
import { mount } from 'enzyme'

import useIsNarrowerThan from './useIsNarrowerThan'

let mockUseMedia
jest.mock('use-media', () => jest.fn(() => mockUseMedia))

// Can't import values from SASS without webpack
jest.mock('@innodoc/client-web/src/style/breakpoints.sss', () => ({
  'screen-xs': '480px',
  'screen-sm': '576px',
  'screen-md': '768px',
  'screen-lg': '992px',
  'screen-xl': '1200px',
  'screen-xxl': '1600px',
}))

const Component = () => (useIsNarrowerThan('sm') ? 'true' : 'false')

describe('useIsNarrowerThan', () => {
  it.each([true, false])('should detect breakpoint (%s)', (res) => {
    mockUseMedia = res
    const wrapper = mount(<Component />)
    expect(wrapper.text()).toBe(res.toString())
  })
})
