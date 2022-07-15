import withMathJaxOptions from './withMathJaxOptions'

let mockCurrentCourse
jest.mock('@innodoc/client-store/src/selectors/course', () => ({
  getCurrentCourse: () => mockCurrentCourse,
}))

const mockStore = { getState: () => {} }

describe('withMathJaxOptions', () => {
  const Component = () => null
  const context = { ctx: { store: mockStore } }
  let WithMathJaxOptions

  beforeEach(() => {
    WithMathJaxOptions = withMathJaxOptions(Component)
  })

  it.each(['default', 'custom'])('should inject %s mathJaxOptions', async (optionType) => {
    expect.assertions(1)
    mockCurrentCourse =
      optionType === 'custom' ? { mathJaxOptions: { chtml: { fontURL: 'foo' } } } : {}
    const props = await WithMathJaxOptions.getInitialProps(context)
    const { fontURL } = props.mathJaxOptions.chtml
    if (optionType === 'default') {
      expect(fontURL).toMatch('/fonts/mathjax-woff-v2')
    } else {
      expect(fontURL).toBe('foo')
    }
  })
})
