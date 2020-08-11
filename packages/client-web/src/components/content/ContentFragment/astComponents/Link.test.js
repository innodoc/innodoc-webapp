import React from 'react'
import { shallow } from 'enzyme'

import ContentFragment from '../ContentFragment'
import Link from './Link'
import { InternalLink } from '../../links'
import Video from './Video'

describe('<Link />', () => {
  it('should render external link', () => {
    const data = [
      [null, [], null],
      [{ t: 'Str', c: 'Wikipedia' }],
      ['https://en.wikipedia.org/', 'link title'],
    ]
    const wrapper = shallow(<Link data={data} />)
    expect(wrapper.exists(InternalLink)).toBe(false)
    const a = wrapper.find('a')
    expect(a).toHaveLength(1)
    expect(a.prop('href')).toEqual('https://en.wikipedia.org/')
    expect(a.prop('title')).toEqual('link title')
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(data[1])
  })

  describe('internal links', () => {
    describe.each(['page', 'section'])('content links (%s)', (contentType) => {
      it('should render (with content)', () => {
        const data = [
          [null, [], null],
          [{ t: 'Str', c: 'Foo bar' }],
          [`/${contentType}/foo/bar`, 'link title'],
        ]
        const wrapper = shallow(<Link data={data} />)
        const internalLink = wrapper.find(InternalLink)
        expect(internalLink).toHaveLength(1)
        expect(internalLink.prop('href')).toEqual(data[2][0])
        expect(wrapper.find('a')).toHaveLength(1)
        const contentFragment = wrapper.find(ContentFragment)
        expect(contentFragment).toHaveLength(1)
        expect(contentFragment.prop('content')).toEqual(data[1])
      })

      it('should render (without content)', () => {
        const data = [[null, [], null], null, [`/${contentType}/foo/bar`, 'link title']]
        const wrapper = shallow(<Link data={data} />)
        const internalLink = wrapper.find(InternalLink)
        expect(internalLink).toHaveLength(1)
        expect(internalLink.prop('href')).toEqual(data[2][0])
        expect(wrapper.find('a')).toHaveLength(0)
        expect(wrapper.exists(ContentFragment)).toBe(false)
      })
    })

    it('should render link with only hash', () => {
      const data = [[null, [], null], [{ t: 'Str', c: 'Foo bar' }], ['#my-id', 'link title']]
      const wrapper = shallow(<Link data={data} />)
      expect(wrapper.find('a').prop('href')).toBe('#my-id')
    })
  })

  it('should render mailto link', () => {
    const content = [{ t: 'Str', c: 'Foo bar' }]
    const data = [[null, [], null], content, ['mailto:alice@example.com', 'alice@example.com']]
    const wrapper = shallow(<Link data={data} />)
    expect(wrapper.exists(InternalLink)).toBe(false)
    const a = wrapper.find('a')
    expect(a.prop('href')).toBe('mailto:alice@example.com')
    expect(a.prop('title')).toBe('alice@example.com')
    expect(wrapper.find(ContentFragment).prop('content')).toBe(content)
  })

  it('should render video component', () => {
    const data = [
      [null, ['video', 'video-youtube'], null],
      null,
      ['https://www.youtube.com/watch?v=abc', 'link title'],
    ]
    const wrapper = shallow(<Link data={data} />)
    expect(wrapper.exists(InternalLink)).toBe(false)
    const video = wrapper.find(Video)
    expect(video.prop('data')).toBe(data)
  })
})
