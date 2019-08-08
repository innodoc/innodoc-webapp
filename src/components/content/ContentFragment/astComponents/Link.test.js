import React from 'react'
import { shallow } from 'enzyme'

import ContentFragment from '../ContentFragment'
import Link from './Link'
import { PageLink, SectionLink } from '../../links'
import Video from './Video'

describe('<Link />', () => {
  it('should render external link', () => {
    const data = [
      [null, [], null],
      [{ t: 'Str', c: 'Wikipedia' }],
      ['https://en.wikipedia.org/', 'link title'],
    ]
    const wrapper = shallow(<Link data={data} />)
    expect(wrapper.exists(SectionLink)).toBe(false)
    const a = wrapper.find('a')
    expect(a).toHaveLength(1)
    expect(a.prop('href')).toEqual('https://en.wikipedia.org/')
    expect(a.prop('title')).toEqual('link title')
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(data[1])
  })

  describe('internal links', () => {
    describe.each([
      ['page', PageLink],
      ['section', SectionLink],
    ])('content links (%s)', (contentType, LinkComponent) => {
      it('should render (with content)', () => {
        const data = [
          [null, [], null],
          [{ t: 'Str', c: 'Foo bar' }],
          [`/${contentType}/foo/bar`, 'link title'],
        ]
        const wrapper = shallow(<Link data={data} />)
        const contentLink = wrapper.find(LinkComponent)
        expect(contentLink).toHaveLength(1)
        expect(contentLink.prop('contentId')).toEqual('foo/bar')
        expect(wrapper.find('a')).toHaveLength(1)
        const contentFragment = wrapper.find(ContentFragment)
        expect(contentFragment).toHaveLength(1)
        expect(contentFragment.prop('content')).toEqual(data[1])
      })

      it('should render (without content)', () => {
        const data = [
          [null, [], null],
          null,
          [`/${contentType}/foo/bar`, 'link title'],
        ]
        const wrapper = shallow(<Link data={data} />)
        const contentLink = wrapper.find(LinkComponent)
        expect(contentLink).toHaveLength(1)
        expect(contentLink.prop('contentId')).toEqual('foo/bar')
        expect(wrapper.find('a')).toHaveLength(0)
        expect(wrapper.exists(ContentFragment)).toBe(false)
      })
    })

    describe('missing prefix', () => {
      it('should render debug error message (in development)', () => {
        const data = [
          [null, [], null],
          [{ t: 'Str', c: 'foo' }],
          ['/foo/bar', 'link title'],
        ]
        const wrapper = shallow(<Link data={data} />)
        expect(wrapper.exists(SectionLink)).toBe(false)
        expect(wrapper.exists(PageLink)).toBe(false)
        expect(wrapper.text()).toMatch('Unhandled internal link: /foo/bar')
        expect(wrapper.find(ContentFragment).prop('content')).toBe(data[1])
      })

      describe('in production', () => {
        beforeEach(() => { process.env.NODE_ENV = 'production' })

        it('should render ContentFragment with content', () => {
          const data = [
            [null, [], null],
            [{ t: 'Str', c: 'foo' }],
            ['/foo/bar', 'link title'],
          ]
          const wrapper = shallow(<Link data={data} />)
          expect(wrapper.exists(SectionLink)).toBe(false)
          expect(wrapper.exists(PageLink)).toBe(false)
          expect(wrapper.find(ContentFragment).prop('content')).toBe(data[1])
        })

        it('should render nothing w/o content', () => {
          const data = [
            [null, [], null],
            null,
            ['/foo/bar', 'link title'],
          ]
          const wrapper = shallow(<Link data={data} />)
          expect(wrapper.exists(SectionLink)).toBe(false)
          expect(wrapper.exists(PageLink)).toBe(false)
          expect(wrapper.exists(ContentFragment)).toBe(false)
        })
      })
    })

    it('should render link with only hash', () => {
      const data = [
        [null, [], null],
        [{ t: 'Str', c: 'Foo bar' }],
        ['#my-id', 'link title'],
      ]
      const wrapper = shallow(<Link data={data} />)
      expect(wrapper.find('a').prop('href')).toBe('#my-id')
    })
  })

  it('should render video component', () => {
    const data = [
      [null, ['video', 'video-youtube'], null],
      null,
      ['https://www.youtube.com/watch?v=abc', 'link title'],
    ]
    const wrapper = shallow(<Link data={data} />)
    expect(wrapper.exists(SectionLink)).toBe(false)
    const video = wrapper.find(Video)
    expect(video.prop('data')).toBe(data)
  })
})
