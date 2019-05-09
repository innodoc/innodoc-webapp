import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import loadScript from 'load-script'

import withMathJax, { typesettingStates } from './withMathJax'

global.process.browser = true

class MockComponent extends React.Component {
  static propTypes = {
    mathJaxContentRef: PropTypes.objectOf(PropTypes.any).isRequired,
    updateMathJax: PropTypes.func.isRequired,
    someValue: PropTypes.string.isRequired,
  }

  componentDidUpdate(prevProps) {
    const { updateMathJax, someValue } = this.props
    if (prevProps.someValue !== someValue) {
      updateMathJax(0, `update1 ${someValue}`)
      updateMathJax(1, `update2 ${someValue}`)
    }
  }

  render() {
    const { mathJaxContentRef } = this.props
    return (
      <div ref={mathJaxContentRef} />
    )
  }
}

const WrapperComponent = withMathJax(MockComponent)

jest.mock('load-script')
let mockJaxes
const queueMock = jest.fn(([cmd, , , cb]) => {
  if (['Typeset', 'Text'].includes(cmd)) {
    cb()
  }
})
loadScript.mockImplementation((path, opts) => {
  let loadScriptCallback
  // add script element (mimic load-script)
  const scriptEl = document.createElement('script')
  scriptEl.type = 'text/javascript'
  scriptEl.id = opts.attrs.id
  document.body.appendChild(scriptEl)
  // mock MathJax object
  window.MathJax = {
    ...window.MathJax,
    Ajax: { config: { path: { } } },
    Hub: {
      getAllJax: () => mockJaxes,
      Register: {
        StartupHook: (eventName, callback) => {
          // steal callback reference
          loadScriptCallback = callback
        },
      },
      Queue: queueMock,
    },
    isReady: true,
  }
  // simulate MathJax init
  window.MathJax.AuthorInit()
  // finally notify component
  loadScriptCallback()
})

describe('<withMathJax />', () => {
  it('renders without MathJax errors', async () => {
    mockJaxes = ['jax1', 'jax2']
    const wrapper = mount(<WrapperComponent someValue="foo" />)
    const mockComp = wrapper.find(MockComponent)
    const mathJaxDiv = mockComp.find('div')

    // render
    expect(mockComp).toHaveLength(1)
    expect(mathJaxDiv).toHaveLength(1)
    expect(mockComp.prop('mathJaxContentRef').current).toEqual(mathJaxDiv.instance())

    // loads MathJax
    expect(loadScript).toBeCalledTimes(1)
    expect(loadScript).nthCalledWith(
      1,
      expect.stringContaining('MathJax.js'),
      { attrs: { id: expect.any(String) } },
    )

    // typesets
    expect(queueMock).toBeCalledTimes(3)
    expect(queueMock).nthCalledWith(
      1,
      [
        'Remove',
        'jax1',
      ]
    )
    expect(queueMock).nthCalledWith(
      2,
      [
        'Remove',
        'jax2',
      ]
    )
    expect(queueMock).nthCalledWith(
      3,
      [
        'Typeset',
        window.MathJax.Hub,
        mathJaxDiv.instance(),
        expect.any(Function),
      ]
    )
    expect(wrapper.state('typesettingStatus')).toEqual(typesettingStates.SUCCESS)

    // update, re-triggers typeset
    await wrapper.setProps({ someValue: 'bar' })
    expect(queueMock).toBeCalledTimes(5)
    expect(queueMock).nthCalledWith(
      4,
      [
        'Text',
        'jax1',
        'update1 bar',
        expect.any(Function),
      ]
    )
    expect(queueMock).nthCalledWith(
      5,
      [
        'Text',
        'jax2',
        'update2 bar',
        expect.any(Function),
      ]
    )
    expect(wrapper.state('typesettingStatus')).toEqual(typesettingStates.SUCCESS)
  })

  it('renders with MathJax errors', () => {
    mockJaxes = ['jax1', { texError: 'error' }]
    const wrapper = mount(<WrapperComponent someValue="foo" />)
    expect(wrapper.state('typesettingStatus')).toEqual(typesettingStates.ERROR)
  })
})
