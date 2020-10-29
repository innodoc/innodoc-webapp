import React from 'react'
import { shallow } from 'enzyme'
import { Tag } from 'antd'
import { AuditOutlined, FormOutlined } from '@ant-design/icons'

import SectionTypeTag from './SectionTypeTag'

jest.mock('@innodoc/common/src/i18n')

describe('<SectionTypeTag />', () => {
  it.each(['exercises', 'test'])('should render (%s)', (type) => {
    const wrapper = shallow(<SectionTypeTag className="foo" type={type} />)
    const tag = wrapper.find(Tag)
    expect(tag.prop('className')).toBe('foo')
    expect(tag.prop('color')).toBe(type === 'test' ? 'blue' : 'green')
    const IconComp = () => tag.prop('icon')
    expect(shallow(<IconComp />).is(type === 'test' ? AuditOutlined : FormOutlined)).toBe(true)
  })

  it('should render empty without type', () => {
    const wrapper = shallow(<SectionTypeTag />)
    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
