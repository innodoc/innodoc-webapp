import React from 'react'
import { mount } from 'enzyme'
import Router from 'next/router'
import MathJax from '@innodoc/react-mathjax-node'

import appSelectors from '@innodoc/client-store/src/selectors'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'
import useContentPane, { scrollToHash } from './useContentPane'
import ContentFragment from '../components/content/ContentFragment'

const stdApp = { language: 'en' }
const contentArr = [{ t: 'Str', c: 'Foo' }]
const stdContent = {
  content: { en: contentArr },
  id: 'foo',
  title: { en: 'Foo title' },
}

const mockGetApp = appSelectors.getApp
let mockApp
let mockContent
let mockSelector
const mockUseSelector = jest.fn((selector) => {
  if (selector === mockGetApp) {
    return mockApp
  }
  return mockContent
})
jest.mock('react-redux', () => ({
  useSelector: (selector) => mockUseSelector(selector),
}))

const ContentComponent = () => {
  const { content, fadeInClassName, id, language, title } = useContentPane(mockSelector)
  return (
    <>
      <h1>{title}</h1>
      <span>{id}</span>
      <span>{language}</span>
      <div className={fadeInClassName}>
        <ContentFragment content={content} />
      </div>
    </>
  )
}

const makeMockProvider = (
  typesetDone = true,
  addCallback = () => {},
  removeCallback = () => {}
) => ({ children }) => (
  <MathJax.Context.Provider value={{ addCallback, removeCallback, typesetDone }}>
    {children}
  </MathJax.Context.Provider>
)

describe('useContentPane', () => {
  beforeEach(() => {
    mockApp = stdApp
    mockContent = stdContent
    mockUseSelector.mockClear()
  })

  it('should render', () => {
    const MockProvider = makeMockProvider()
    const wrapper = mount(
      <MockProvider>
        <ContentComponent />
      </MockProvider>
    )
    expect(mockUseSelector).toBeCalledWith(mockSelector)
    expect(wrapper.find('h1').text()).toBe('Foo title')
    expect(wrapper.find('span').at(0).text()).toBe('foo')
    expect(wrapper.find('span').at(1).text()).toBe('en')
  })

  it('should provide add/remove callback scrollToHash', () => {
    const addCallback = jest.fn()
    const removeCallback = jest.fn()
    const MockProvider = makeMockProvider(true, addCallback, removeCallback)
    const wrapper = mount(
      <MockProvider>
        <ContentComponent />
      </MockProvider>
    )
    expect(addCallback).toBeCalledTimes(1)
    expect(addCallback).toBeCalledWith(scrollToHash)
    wrapper.unmount()
    expect(removeCallback).toBeCalledTimes(1)
    expect(removeCallback).toBeCalledWith(scrollToHash)
  })

  describe('fade in/out', () => {
    it.each([
      ['in', true],
      ['out', false],
    ])('should fade %s depending on typesetDone', (_, typesetDone) => {
      const MockProvider = makeMockProvider(typesetDone)
      const wrapper = mount(
        <MockProvider>
          <ContentComponent />
        </MockProvider>
      )
      const div = wrapper.find('div')
      expect(div.hasClass(fadeInCss.show)).toBe(typesetDone)
      expect(div.hasClass(fadeInCss.hide)).toBe(!typesetDone)
    })

    it.each([
      ['in', true, stdApp, stdContent],
      ['out', false, {}, stdContent],
      ['out', false, stdApp, null],
      ['out', false, stdApp, { content: { de: contentArr } }],
    ])('should fade %s depending on content load state', (_, show, app, content) => {
      mockApp = app
      mockContent = content
      const MockProvider = makeMockProvider()
      const wrapper = mount(
        <MockProvider>
          <ContentComponent />
        </MockProvider>
      )
      const div = wrapper.find('div')
      expect(div.hasClass(fadeInCss.show)).toBe(show)
      expect(div.hasClass(fadeInCss.hide)).toBe(!show)
    })
  })
})

jest.mock('next/router', () => ({
  router: {
    scrollToHash: jest.fn(),
    asPath: '/some/path#id',
  },
}))

describe('scrollToHash', () => {
  let windowSpy

  beforeEach(() => {
    windowSpy = jest.spyOn(global, 'window', 'get')
    Router.router.scrollToHash.mockClear()
  })
  afterEach(() => {
    windowSpy.mockRestore()
  })

  it.each([
    ['browser', true],
    ['server', undefined],
  ])('should scroll to hash (%s)', (_, isBrowser) => {
    windowSpy.mockImplementation(() => (isBrowser ? {} : undefined))
    scrollToHash()
    expect(Router.router.scrollToHash.mock.calls).toHaveLength(isBrowser ? 1 : 0)
  })
})
