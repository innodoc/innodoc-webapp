import { getDisplayName, getWrappedComponentProps } from './util'

describe('getDisplayName', () => {
  it('should return the displayName using "displayName"', () => {
    const WrappedComponent = () => {}
    WrappedComponent.displayName = 'BarComponent'
    expect(getDisplayName('FooComponent', WrappedComponent)).toBe(
      'FooComponent(BarComponent)'
    )
  })

  it('should return the displayName using "name"', () => {
    const WrappedComponent = () => {}
    expect(getDisplayName('FooComponent', WrappedComponent)).toBe(
      'FooComponent(WrappedComponent)'
    )
  })
})

describe('getWrappedComponentProps', () => {
  it('should return props of wrapped component', () => {
    const WrappedComponent = () => {}
    WrappedComponent.getInitialProps = () => ({ foo: 'bar' })
    expect(getWrappedComponentProps(WrappedComponent, {}).foo).toBe('bar')
  })

  it('should return default page props if getInitialProps is not present', () => {
    const WrappedComponent = () => {}
    expect(getWrappedComponentProps(WrappedComponent, {})).toMatchObject({
      pageProps: expect.any(Object),
    })
  })
})
