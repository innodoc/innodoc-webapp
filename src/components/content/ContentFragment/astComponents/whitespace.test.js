import React from 'react'
import { render } from 'enzyme'

import { Space, LineBreak, SoftBreak } from './whitespace'

describe('<Space />', () => {
  it('should render', () => {
    const wrapper = render(
      <span>
        <Space />
      </span>
    )
    expect(wrapper.text()).toEqual(' ')
  })
})

describe('<LineBreak />', () => {
  it('should render', () => {
    const wrapper = render(
      <span>
        <LineBreak />
      </span>
    )
    expect(wrapper.html()).toEqual('<br>')
  })
})

describe('<SoftBreak />', () => {
  it('should render', () => {
    const wrapper = render(
      <span>
        <SoftBreak />
      </span>
    )
    expect(wrapper.text()).toEqual(' ')
  })
})
