import React from 'react'
import { shallow } from 'enzyme'

import PageTitle from '../PageTitle'
import PageContent from './PageContent'
import ContentFragment from './ContentFragment'

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
    expect(wrapper.find('h1').text()).toEqual('Foo page')
    expect(wrapper.find(ContentFragment).prop('content')).toBe(mockContent)
    expect(wrapper.find(PageTitle).prop('children')).toBe('Foo page')
  })
})
