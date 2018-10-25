import React from 'react'
import { shallow } from 'enzyme'
import { Placeholder as SemanticPlaceholder } from 'semantic-ui-react'

import BreadcrumbPlaceholder from './Placeholder'

describe('<Placeholder />', () => {
  it('renders', () => {
    const wrapper = shallow(<BreadcrumbPlaceholder />)
    expect(wrapper.find(SemanticPlaceholder).length).toBeGreaterThanOrEqual(1)
  })
})
