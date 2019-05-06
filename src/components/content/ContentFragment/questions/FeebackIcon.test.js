import React from 'react'
import { shallow } from 'enzyme'
import Icon from 'antd/lib/icon'

import { BareFeedbackIcon } from './FeedbackIcon'

describe('<FeedbackIcon />', () => {
  it.each([
    [null, 'ellipsis'],
    [true, 'check-circle'],
    [false, 'close-circle'],
  ])('should render (correct=%s)', (correct, iconType) => {
    const wrapper = shallow(<BareFeedbackIcon correct={correct} t={() => {}} />)
    const icon = wrapper.find(Icon)
    expect(icon.prop('type')).toBe(iconType)
  })
})
