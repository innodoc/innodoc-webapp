import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'

import makeContentLink from './makeContentLink'

let mockContent
jest.mock('react-redux', () => ({ useSelector: () => mockContent }))

const ContentLink = makeContentLink(() => {}, 'content')

describe('makeContentLink', () => {
  beforeEach(() => {
    mockContent = {
      contentId: 'foo',
      title: 'Foo title',
    }
  })

  it('makes a Component', () => {
    expect(ContentLink).toBeInstanceOf(Function)
  })

  it('renders', () => {
    const wrapper = shallow(<ContentLink contentId="foo" />)
    const link = wrapper.find(Link)
    expect(link.prop('href')).toEqual({
      pathname: '/content',
      query: { contentId: 'foo' },
    })
    expect(link.prop('as')).toEqual({ pathname: '/content/foo' })
    const a = wrapper.find('a')
    expect(a.text()).toEqual('Foo title')
  })

  it('renders with custom content', () => {
    const wrapper = shallow(
      <ContentLink contentId="foo/bar">
        <a>Hello World!</a>
      </ContentLink>
    )
    const link = wrapper.find(Link)
    expect(link.prop('href')).toEqual({
      pathname: '/content',
      query: { contentId: 'foo' },
    })
    expect(link.prop('as')).toEqual({ pathname: '/content/foo' })
    const a = wrapper.find('a')
    expect(a.prop('title')).toEqual('Foo title')
    expect(a.text()).toEqual('Hello World!')
  })

  it('renders with hash', () => {
    mockContent = {
      contentId: 'foo',
      title: 'Foo title',
      hash: 'bar',
    }
    const wrapper = shallow(<ContentLink contentId="foo#bar" />)
    const link = wrapper.find(Link)
    expect(link.prop('href')).toEqual({
      pathname: '/content',
      query: { contentId: 'foo' },
    })
    expect(link.prop('as')).toEqual({
      pathname: '/content/foo',
      hash: '#bar',
    })
  })
})
