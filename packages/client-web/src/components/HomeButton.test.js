import React from 'react'
import { shallow } from 'enzyme'
import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import HomeButton from './HomeButton'
import { InternalLink } from './content/links'

jest.mock('react-redux', () => ({
  useSelector: () => ({
    homeLink: '/page/foo',
  }),
}))

jest.mock('@innodoc/common/src/i18n')

describe('<HomeButton />', () => {
  it('should render', () => {
    const wrapper = shallow(<HomeButton />)
    expect(wrapper.find(InternalLink).prop('href')).toBe('/page/foo')
    const button = wrapper.find(Button)
    expect(button.prop('icon')).toEqual(<HomeOutlined />)
    expect(button.prop('type')).toBe('primary')
    expect(button.prop('children')).toBe('common.home')
  })
})
