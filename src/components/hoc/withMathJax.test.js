import React from 'react'
import PropTypes from 'prop-types'
import { mount } from 'enzyme'
import loadScript from 'load-script'

import withMathJax from './withMathJax'

jest.mock('load-script')

describe('<withMathJax />', () => {
  const QueueMock = jest.fn()

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
        Register: {
          StartupHook: (eventName, callback) => {
            // steal callback reference
            loadScriptCallback = callback
          },
        },
        Queue: QueueMock,
      },
      isReady: true,
    }
    // simulate MathJax init
    window.MathJax.AuthorInit()
    // finally notify component
    loadScriptCallback()
  })

  class MockComponent extends React.Component {
    static propTypes = {
      mathJaxContentRef: PropTypes.objectOf(PropTypes.any).isRequired,
      typesetMathJax: PropTypes.func.isRequired,
    }

    componentDidMount() {
      const { typesetMathJax } = this.props
      typesetMathJax()
    }

    render() {
      const { mathJaxContentRef } = this.props
      return (
        <p ref={mathJaxContentRef}>
          Some inline math please!
        </p>
      )
    }
  }

  const WrapperComponent = withMathJax(MockComponent)
  const wrapper = mount(<WrapperComponent />)
  const mockComp = wrapper.find(MockComponent)
  const paragraph = mockComp.find('p')

  it('renders', () => {
    expect(mockComp).toHaveLength(1)
    expect(paragraph).toHaveLength(1)
    expect(mockComp.prop('mathJaxContentRef').current).toEqual(paragraph.instance())
  })

  it('loads MathJax lib', () => {
    expect(loadScript).toBeCalledTimes(1)
    expect(loadScript).nthCalledWith(
      1,
      '/static/vendor/MathJax/unpacked/MathJax.js',
      { attrs: { id: expect.any(String) } },
    )
  })

  it('triggers typesetting', () => {
    expect(QueueMock).toBeCalledTimes(1)
    expect(QueueMock).nthCalledWith(
      1,
      [
        'Typeset',
        window.MathJax.Hub,
        paragraph.instance(),
      ]
    )
  })
})
