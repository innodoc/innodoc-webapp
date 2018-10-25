import React from 'react'
import { shallow } from 'enzyme'
import { Placeholder as SemanticPlaceholder } from 'semantic-ui-react'
import BreadcrumbPlaceholder from '../Breadcrumb/Placeholder'

import Placeholder from './Placeholder'

describe('<Placeholder />', () => {
  it('renders', () => {
    const wrapper = shallow(<Placeholder />)
    expect(wrapper.find(BreadcrumbPlaceholder)).toHaveLength(1)
    expect(wrapper.find(SemanticPlaceholder).length).toBeGreaterThanOrEqual(1)
  })
})
