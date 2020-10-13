import React from 'react'
import { shallow } from 'enzyme'
import { Affix } from 'antd'

import css from './style.sss'
import ContentAffix from './ContentAffix'
import Breadcrumb from './Breadcrumb'
import AffixButtons from './AffixButtons'

jest.mock('@innodoc/common/src/i18n')

describe('ContentAffix', () => {
  it('should render', () => {
    const wrapper = shallow(<ContentAffix />)
    expect(wrapper.exists(Breadcrumb)).toBe(true)
    expect(wrapper.exists(AffixButtons)).toBe(true)
  })

  it.each([true, false])('should set affixed class (%s)', (affixed) => {
    const wrapper = shallow(<ContentAffix />)
    wrapper.find(Affix).prop('onChange')(affixed)
    expect(wrapper.find('div').first().hasClass(css.affixed)).toBe(affixed)
  })
})
