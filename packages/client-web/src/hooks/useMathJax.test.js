import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'

// mock MathJax injection and start-up
const mockDocument = document
const mockWindow = window
let mockAllJax
const mockQueueImpl = (arr, jax) => {
  if (arr[0] === 'Typeset') {
    mockAllJax.push(jax)
    arr[3]()
  } else if (arr[0] === 'Remove') {
    mockAllJax.splice(mockAllJax.indexOf(arr[1]), 1)
  }
}
let mockQueue
let mockMathJaxStartupHooks
let mockSkipLoadScript
jest.mock('load-script', () => (
  () => {
    if (!mockSkipLoadScript) {
      const scriptEl = mockDocument.createElement('script')
      scriptEl.setAttribute('id', '__MATHJAX_SCRIPT__')
      mockDocument.body.appendChild(scriptEl)
      mockWindow.MathJax.Ajax = { config: { path: {} } }
      mockWindow.MathJax.Hub = {
        getAllJax: () => mockAllJax,
        Register: { StartupHook: (_, cb) => mockMathJaxStartupHooks.push(cb) },
        Queue: mockQueue,
      }
      mockWindow.MathJax.AuthorInit()
      mockMathJaxStartupHooks.forEach((cb) => cb())
      mockWindow.MathJax.isReady = true
    }
  })
)

let mathDelimiter
let typesetStates
let useMathJax
let useMathJaxRemoveOnUnmount
let useMathJaxScanElement

const MathJaxComponent = ({ texCode }) => {
  const { mathJaxElem, typesetState } = useMathJax(texCode)
  return (
    <div>
      <div id="typesetState">{typesetState}</div>
      <div id="mathJaxDiv" ref={mathJaxElem} />
    </div>
  )
}
MathJaxComponent.propTypes = { texCode: PropTypes.string.isRequired }

const MathJaxComponentElement = ({ texCode }) => {
  const mathJaxElem = useMathJaxRemoveOnUnmount()
  return (
    <span ref={mathJaxElem}>
      {mathDelimiter.inline[0]}
      {texCode}
      {mathDelimiter.inline[1]}
    </span>
  )
}
MathJaxComponentElement.propTypes = { texCode: PropTypes.string.isRequired }

const MathJaxComponentScanElement = ({ texCode }) => {
  const { mathJaxElem, typesetState } = useMathJaxScanElement([texCode])
  return (
    <div>
      <div id="typesetState">{typesetState}</div>
      <div id="mathJaxDiv" ref={mathJaxElem}>
        <MathJaxComponentElement texCode={texCode} />
      </div>
    </div>
  )
}
MathJaxComponentScanElement.propTypes = { texCode: PropTypes.string.isRequired }

describe('useMathJax', () => {
  beforeEach(() => {
    // reset local module state (mathJaxInjected)
    jest.isolateModules(() => {
      ({
        default: useMathJax,
        mathDelimiter,
        typesetStates,
        useMathJaxRemoveOnUnmount,
        useMathJaxScanElement,
      } = require('./useMathJax')) // eslint-disable-line global-require
    })
    const scriptEl = document.getElementById('__MATHJAX_SCRIPT__')
    if (scriptEl) { scriptEl.remove() }
    process.browser = true
    mockQueue = jest.fn((arr) => mockQueueImpl(arr, { mock: 'jaxObject' }))
    mockAllJax = []
    mockMathJaxStartupHooks = []
    mockSkipLoadScript = false
  })

  it('should render useMathJax and unmount', () => {
    const wrapper = mount(<MathJaxComponent texCode="f(x)=x^2" />)
    const mathJaxDiv = wrapper.find('div#mathJaxDiv')
    expect(mathJaxDiv.text()).toBe(`${mathDelimiter.inline[0]}f(x)=x^2${mathDelimiter.inline[1]}`)
    expect(mockQueue).toBeCalledTimes(1)
    const typesetArg = mockQueue.mock.calls[0][0]
    expect(typesetArg[0]).toBe('Typeset')
    expect(typesetArg[2]).toBe(mathJaxDiv.getDOMNode())
    expect(typesetArg[3]).toBeInstanceOf(Function)
    expect(parseInt(wrapper.find('div#typesetState').text(), 10)).toBe(typesetStates.SUCCESS)
    wrapper.unmount()
    expect(mockQueue).toBeCalledTimes(2)
    const removeArg = mockQueue.mock.calls[1][0]
    expect(removeArg[0]).toBe('Remove')
    expect(removeArg[1].mock).toBe('jaxObject')
    // mount another MathJaxComponent to trigger isMathJaxLoaded code path
    mount(<MathJaxComponent texCode="f(x)=x^2" />)
  })

  it('should render useMathJaxScanElement', () => {
    const wrapper = mount(<MathJaxComponentScanElement texCode="f(x)=x^2" />)
    const mathJaxDiv = wrapper.find('div#mathJaxDiv')
    expect(mathJaxDiv.text()).toBe(`${mathDelimiter.inline[0]}f(x)=x^2${mathDelimiter.inline[1]}`)
    expect(mockQueue).toBeCalledTimes(1)
    expect(mockAllJax).toHaveLength(1)
    expect(parseInt(wrapper.find('div#typesetState').text(), 10)).toBe(typesetStates.SUCCESS)
    wrapper.unmount()
    expect(mockAllJax).toHaveLength(0)
    expect(mockQueue).toBeCalledTimes(2)
  })

  it('should render erroneous TeX code', () => {
    mockQueue = jest.fn((arr) => mockQueueImpl(arr, { texError: true }))
    expect(document.getElementById('__MATHJAX_SCRIPT__')).toBe(null)
    const wrapper = mount(<MathJaxComponent texCode="f(x)=x^" />)
    const mathJaxDiv = wrapper.find('div#mathJaxDiv')
    expect(mathJaxDiv.text()).toBe(`${mathDelimiter.inline[0]}f(x)=x^${mathDelimiter.inline[1]}`)
    expect(mockQueue).toBeCalledTimes(1)
    const typesetArg = mockQueue.mock.calls[0][0]
    expect(typesetArg[0]).toBe('Typeset')
    expect(typesetArg[2]).toBe(mathJaxDiv.getDOMNode())
    expect(typesetArg[3]).toBeInstanceOf(Function)
    expect(parseInt(wrapper.find('div#typesetState').text(), 10)).toBe(typesetStates.ERROR)
  })

  it('should inject MathJax client-side', () => {
    expect(document.getElementById('__MATHJAX_SCRIPT__')).toBe(null)
    mount(<MathJaxComponent texCode="f(x)=x^2" />)
    expect(document.getElementById('__MATHJAX_SCRIPT__')).toBeInstanceOf(HTMLScriptElement)
  })

  it('should not inject MathJax server-side', () => {
    process.browser = false
    mount(<MathJaxComponent texCode="f(x)=x^2" />)
    expect(mockQueue).not.toBeCalled()
  })

  // can't really test internal callbacks but we make sure code path is taken
  it('should remove MathJax onLoad callback on unmount', () => {
    mockSkipLoadScript = true // make sure MathJax is not loaded before unmount happens
    mount(<MathJaxComponent texCode="f(x)=x^2" />).unmount()
    expect(mockQueue).not.toBeCalled()
  })
})
