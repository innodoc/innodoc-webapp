import React from 'react'
import { shallow } from 'enzyme'
import { Col, Progress, Typography } from 'antd'

import ChapterPieChart from './ChapterPieChart'

describe('<ChapterPieChart />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ChapterPieChart
        description="Description"
        percent={23}
        status="success"
        title="Title"
        wideLayout
      />
    )
    const progress = wrapper.find(Progress)
    expect(progress.prop('percent')).toBe(23)
    expect(progress.prop('status')).toBe('success')
    expect(wrapper.find(Typography.Text).prop('children')).toBe('Title')
    expect(wrapper.find(Col).at(2).prop('children')[2]).toMatch('Description')
  })
})
