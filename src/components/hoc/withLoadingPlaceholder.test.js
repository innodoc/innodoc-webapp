import React from 'react'
import { shallow } from 'enzyme'
import { Dimmer, Loader } from 'semantic-ui-react'

import withLoadingPlaceholder from './withLoadingPlaceholder'

describe('<withLoadingPlaceholder />', () => {
  const MockPlaceholder = () => (
    <p>
      Some content here
    </p>
  )
  const MockComponent = () => (
    <p>
      Some content here
    </p>
  )
  const WrapperComponent = withLoadingPlaceholder(MockPlaceholder)(MockComponent)

  it('renders placeholder while loading', () => {
    const wrapper = shallow(<WrapperComponent loading />)
    expect(wrapper.find(Dimmer)).toHaveLength(1)
    expect(wrapper.find(Loader)).toHaveLength(1)
    expect(wrapper.find(MockPlaceholder)).toHaveLength(1)
    expect(wrapper.find(MockComponent)).toHaveLength(0)
  })

  it('renders component if not loading', () => {
    const wrapper = shallow(<WrapperComponent loading={false} someOtherProp={42} />)
    expect(wrapper.find(Dimmer)).toHaveLength(1)
    expect(wrapper.find(Loader)).toHaveLength(1)
    expect(wrapper.find(MockPlaceholder)).toHaveLength(0)
    expect(wrapper.find(MockComponent)).toHaveLength(1)
    expect(wrapper.find(MockComponent).prop('someOtherProp')).toEqual(42)
  })
})
