import React from 'react'
import { shallow } from 'enzyme'

import ContentFragment from './ContentFragment'
import { BulletList, Para, UnknownType } from './astComponents'

describe('<ContentFragment />', () => {
  it('renders', () => {
    const contentData = [{
      t: 'Para',
      c: [{
        t: 'Str',
        c: 'This is a paragraph!',
      }],
    }, {
      t: 'BulletList',
      c: [
        [{
          t: 'Plain',
          c: [{
            t: 'Str',
            c: 'Bullet point 1',
          }],
        }],
        [{
          t: 'Plain',
          c: [{
            t: 'Str',
            c: 'Bullet point 2',
          }],
        }],
      ],
    }]
    const wrapper = shallow(
      <ContentFragment content={contentData} />
    )
    const para = wrapper.find(Para)
    expect(para).toHaveLength(1)
    expect(para.prop('data')).toEqual(contentData[0].c)
    const list = wrapper.find(BulletList)
    expect(list).toHaveLength(1)
    expect(list.prop('data')).toEqual(contentData[1].c)
  })

  it('should render UnknownType for unknown elements', () => {
    const contentData = [{ t: 'ThisTypeDoesNotExist', c: ['foo'] }]
    const wrapper = shallow(
      <ContentFragment content={contentData} />
    )
    expect(wrapper.find(UnknownType)).toHaveLength(1)
  })
})
