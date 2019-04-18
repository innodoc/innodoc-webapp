import React from 'react'
import { shallow } from 'enzyme'
import Link from 'next/link'

import { mapStateToProps, SectionLinkBare as SectionLink } from './SectionLink'

describe('<SectionLink />', () => {
  it('renders with custom content', () => {
    const wrapper = shallow(
      <SectionLink sectionId="foo/bar" content="Foo bar" />
    )
    const link = wrapper.find(Link)
    expect(link).toBeTruthy()
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionId: 'foo/bar' },
    })
    expect(wrapper.find('a').text()).toEqual('Foo bar')
  })

  it('renders with custom text', () => {
    const wrapper = shallow(
      <SectionLink sectionId="foo/bar" title="Foo title">
        <a>
          Hello World!
        </a>
      </SectionLink>
    )
    const link = wrapper.find(Link)
    expect(link).toBeTruthy()
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionId: 'foo/bar' },
    })
    expect(link.prop('as')).toEqual({ pathname: '/page/foo/bar' })
    const a = wrapper.find('a')
    expect(a.prop('title')).toEqual('Foo title')
  })

  it('renders with hash', () => {
    const wrapper = shallow(
      <SectionLink sectionId="foo/bar" hash="baz">
        <a>Foo</a>
      </SectionLink>
    )
    const link = wrapper.find(Link)
    expect(link).toBeTruthy()
    expect(link.prop('href')).toEqual({
      pathname: '/page',
      query: { sectionId: 'foo/bar' },
    })
    expect(link.prop('as')).toEqual({
      pathname: '/page/foo/bar',
      hash: '#baz',
    })
  })
})

jest.mock('../store/selectors/index.js', () => ({
  getApp: () => ({ language: 'en' }),
}))
jest.mock('../store/selectors/section/index.js', () => ({
  getSection: (state, sectionId) => {
    if (sectionId === 'foo/bar') {
      return { id: 'foo/bar', content: ['foocontent'], title: { en: 'Bar' } }
    }
    throw Error()
  },
}))

describe('mapStateToProps', () => {
  it('returns section title for link content', () => {
    const ownProps = { children: null, sectionId: 'foo/bar' }
    const props = mapStateToProps(null, ownProps)
    expect(props.sectionId).toEqual('foo/bar')
    expect(props.content).toEqual('Bar')
    expect(props).not.toContain('hash')
  })

  it("doesn't return section title for custom content ", () => {
    const children = <a>Baz</a>
    const ownProps = { children, sectionId: 'foo/bar' }
    const props = mapStateToProps(null, ownProps)
    expect(props.sectionId).toEqual('foo/bar')
    expect(props).not.toContain('content')
    expect(props).not.toContain('hash')
  })

  it('returns hash', () => {
    const ownProps = { sectionId: 'foo/bar#baz' }
    const props = mapStateToProps(null, ownProps)
    expect(props.sectionId).toEqual('foo/bar')
    expect(props.content).toEqual('Bar')
    expect(props.hash).toEqual('baz')
  })

  it('notices unknown section', () => {
    const ownProps = { sectionId: 'does/not/exist' }
    const props = mapStateToProps(null, ownProps)
    expect(props.sectionId).toEqual('does/not/exist')
    expect(props.content).toEqual('UNKNOWN SECTION ID')
  })
})
