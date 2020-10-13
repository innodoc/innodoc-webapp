import React from 'react'
import { shallow } from 'enzyme'
import { Typography } from 'antd'

import PageTitle from '../PageTitle'
import PageContent from './PageContent'
import ContentFragment from './ContentFragment'

jest.mock('@innodoc/common/src/i18n')

const mockContent = [{ t: 'Str', c: 'A nice string' }]
const mockRef = React.createRef()
jest.mock('../../hooks/useContentPane', () => () => ({
  content: mockContent,
  fadeInClassName: 'show',
  mathJaxElem: mockRef,
  title: 'Foo page',
}))

describe('<PageContent />', () => {
  it('should render', () => {
    const wrapper = shallow(<PageContent />)
    expect(wrapper.find(Typography.Title).children().text()).toBe('Foo page')
    expect(wrapper.find(ContentFragment).prop('content')).toBe(mockContent)
    expect(wrapper.find(PageTitle).prop('children')).toBe('Foo page')
  })
})
