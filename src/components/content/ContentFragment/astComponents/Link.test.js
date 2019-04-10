import React from 'react'
import { shallow } from 'enzyme'

import Link from './Link'
import SectionLink from '../../../SectionLink'
import ContentFragment from '../ContentFragment'
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

  it('should render section link (with content)', () => {
    const data = [
      [null, [], null],
      [{ t: 'Str', c: 'Foo bar' }],
      ['foo/bar', 'link title'],
    ]
    const wrapper = shallow(<Link data={data} />)
    const sectionLink = wrapper.find(SectionLink)
    expect(sectionLink).toHaveLength(1)
    expect(sectionLink.prop('sectionId')).toEqual('foo/bar')
    const a = wrapper.find('a')
    expect(a).toHaveLength(1)
    const contentFragment = wrapper.find(ContentFragment)
    expect(contentFragment).toHaveLength(1)
    expect(contentFragment.prop('content')).toEqual(data[1])
  })

  it('should render section link (without content)', () => {
    const data = [
      [null, [], null],
      null,
      ['foo/bar', 'link title'],
    ]
    const wrapper = shallow(<Link data={data} />)
    const sectionLink = wrapper.find(SectionLink)
    expect(sectionLink).toHaveLength(1)
    expect(sectionLink.prop('sectionId')).toEqual('foo/bar')
    const a = wrapper.find('a')
    expect(a).toHaveLength(1)
    expect(wrapper.exists(ContentFragment)).toBe(false)
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
