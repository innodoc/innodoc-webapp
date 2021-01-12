import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'

import appSelectors from '@innodoc/client-store/src/selectors'
import makeContentLink from './makeContentLink'

let mockContent
const mockGetApp = appSelectors.getApp
const mockApp = { sectionPathPrefix: 'sec' }
jest.mock('react-redux', () => ({
  useSelector: (selector) => (selector === mockGetApp ? mockApp : mockContent),
}))

const ContentLink = makeContentLink(() => {}, 'section')

describe('makeContentLink', () => {
  beforeEach(() => {
    mockContent = {
      contentId: 'foo',
      shortTitle: 'Foo',
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
      pathname: '/[contentPrefix]/[...fragments]',
      query: {
        contentPrefix: 'sec',
        fragments: ['foo'],
      },
    })
    expect(link.prop('as')).toEqual({ pathname: '/sec/foo' })
    const a = wrapper.find('a')
    expect(a.text()).toEqual('Foo title')
  })

  it('renders short title', () => {
    const wrapper = shallow(<ContentLink contentId="foo" preferShortTitle />)
    expect(wrapper.find(Link).find('a').text()).toEqual('Foo')
  })

  it('renders with custom content', () => {
    const wrapper = shallow(
      <ContentLink contentId="foo/bar">
        <a>Hello World!</a>
      </ContentLink>
    )
    const link = wrapper.find(Link)
    expect(link.prop('href')).toEqual({
      pathname: '/[contentPrefix]/[...fragments]',
      query: {
        contentPrefix: 'sec',
        fragments: ['foo'],
      },
    })
    expect(link.prop('as')).toEqual({ pathname: '/sec/foo' })
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
      pathname: '/[contentPrefix]/[...fragments]',
      query: {
        contentPrefix: 'sec',
        fragments: ['foo'],
      },
    })
    expect(link.prop('as')).toEqual({
      pathname: '/sec/foo',
      hash: '#bar',
    })
  })
})
