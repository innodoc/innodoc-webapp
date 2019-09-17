import React from 'react'
import { shallow } from 'enzyme'
import Icon from 'antd/es/icon'

import FeedbackIcon from './FeedbackIcon'

describe('<FeedbackIcon />', () => {
  it.each([
    [null, 'ellipsis'],
    [true, 'check-circle'],
    [false, 'close-circle'],
  ])('should render (correct=%s)', (correct, iconType) => {
    const wrapper = shallow(<FeedbackIcon correct={correct} />)
    const icon = wrapper.find(Icon)
    expect(icon.prop('type')).toBe(iconType)
  })
})
