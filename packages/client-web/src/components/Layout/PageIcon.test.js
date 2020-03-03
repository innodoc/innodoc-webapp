import React from 'react'
import { shallow } from 'enzyme'
import { InfoCircleOutlined, CopyrightOutlined } from '@ant-design/icons'

import PageIcon from './PageIcon'

describe('<PageIcon />', () => {
  it('should render InfoCircleOutlined', () => {
    const wrapper = shallow(<PageIcon type="info-circle" />)
    expect(wrapper.find(InfoCircleOutlined).exists()).toBe(true)
  })

  it('should render CopyrightOutlined', () => {
    const wrapper = shallow(<PageIcon type="copyright" />)
    expect(wrapper.find(CopyrightOutlined).exists()).toBe(true)
  })

  it('should not render unknown icon', () => {
    const wrapper = shallow(<PageIcon type="this-icon-does-not-exist" />)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
