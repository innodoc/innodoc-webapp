import React from 'react'
import { shallow } from 'enzyme'

import TocPage from './TocPage'
import Layout from '../Layout'
import PageTitle from '../common/PageTitle'
import Toc from '../Toc'

jest.mock('@innodoc/common/src/i18n')

describe('<TocPage />', () => {
  it('should render', () => {
    const wrapper = shallow(<TocPage />)
    const layout = wrapper.find(Layout)
    expect(layout.exists()).toBe(true)
    expect(layout.prop('disableSidebar')).toBe(true)
    const toc = layout.find(Toc)
    expect(toc.exists()).toBe(true)
    expect(toc.prop('expandAll')).toBe(true)
    expect(wrapper.find(PageTitle).prop('children')).toBe('common.toc')
  })
})
