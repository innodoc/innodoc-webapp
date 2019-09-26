import React from 'react'
import { shallow } from 'enzyme'
import Router from 'next/router'

import appSelectors from '@innodoc/client-store/src/selectors'

import fadeInCss from '@innodoc/client-web/src/style/fade-in.sss'
import useContentPane, { scrollToHash } from './useContentPane'
import ContentFragment from '../components/content/ContentFragment'

const { typesetStates } = jest.requireActual('./useMathJax')

const stdApp = { language: 'en' }
const contentArr = [{ t: 'Str', c: 'Foo' }]
const stdContent = {
  content: { en: contentArr },
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

let mockMathJaxElem
let mockTypesetState
const mockUseMathJaxScanElement = jest.fn(() => ({
  mathJaxElem: mockMathJaxElem,
  typesetState: mockTypesetState,
}))
jest.mock('./useMathJax', () => ({
  typesetStates: jest.requireActual('./useMathJax').typesetStates,
  useMathJaxScanElement: (...args) => mockUseMathJaxScanElement(...args),
}))

const ContentComponent = () => {
  const {
    content,
    fadeInClassName,
    language,
    mathJaxElem,
    title,
  } = useContentPane(mockSelector)
  return (
    <>
      <h1>{title}</h1>
      <span>{language}</span>
      <div className={fadeInClassName} ref={mathJaxElem}>
        <ContentFragment content={content} />
      </div>
    </>
  )
}

describe('useContentPane', () => {
  beforeEach(() => {
    mockApp = stdApp
    mockContent = stdContent
    mockUseSelector.mockClear()
    mockUseMathJaxScanElement.mockClear()
    mockMathJaxElem = React.createRef()
    mockTypesetState = typesetStates.PENDING
  })

  it('should render', () => {
    const wrapper = shallow(<ContentComponent />)
    expect(mockUseSelector).toBeCalledWith(mockSelector)
    expect(wrapper.find('h1').text()).toBe('Foo title')
    expect(wrapper.find('span').text()).toBe('en')
  })

  it('should use MathJax', () => {
    shallow(<ContentComponent />)
    expect(mockUseMathJaxScanElement).toBeCalledWith(['en', mockContent], scrollToHash)
  })

  describe('fade in/out', () => {
    it.each([
      ['in', true, typesetStates.SUCCESS],
      ['out', false, typesetStates.PENDING],
    ])('should fade %s depending on MathJax typesetting', (_, show, typesetState) => {
      mockTypesetState = typesetState
      const wrapper = shallow(<ContentComponent />)
      const div = wrapper.find('div')
      expect(div.hasClass(fadeInCss.show)).toBe(show)
      expect(div.hasClass(fadeInCss.hide)).toBe(!show)
    })

    it.each([
      ['in', true, stdApp, stdContent],
      ['out', false, {}, stdContent],
      ['out', false, stdApp, null],
      ['out', false, stdApp, { content: { de: contentArr } }],
    ])('should fade %s depending on content load state', (_, show, app, content) => {
      mockApp = app
      mockContent = content
      mockTypesetState = typesetStates.SUCCESS
      const wrapper = shallow(<ContentComponent />)
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
  beforeEach(() => Router.router.scrollToHash.mockClear())
  it.each([['browser', true], ['server', false]])('should scroll to hash (%s)', (_, browser) => {
    process.browser = browser
    scrollToHash()
    expect(Router.router.scrollToHash.mock.calls).toHaveLength(browser ? 1 : 0)
  })
})
