import React from 'react'
import { shallow } from 'enzyme'

import Figure from './Figure'
import ContentFragment from '../ContentFragment'
import ImageTag from './Image'

const content = [{
  t: 'Para',
  c: [
    {
      t: 'Image',
      c: [
        ['', ['img'], []],
        [
          {
            t: 'Str',
            c: 'The Creation of Adam by Michelangelo',
          },
        ],
        [
          '02-elements/06-media/adam.jpg',
          'fig:The Creation of Adam',
        ],
      ],
    },
  ],
}]

describe('<Figure />', () => {
  it('should render', () => {
    const wrapper = shallow(<Figure content={content} />)
    expect(wrapper.find('figure')).toHaveLength(1)
    const figcaption = wrapper.find('figcaption')
    expect(figcaption).toHaveLength(1)
    const figContent = content[0].c[0].c[1]
    expect(figcaption.find(ContentFragment).prop('content')).toEqual(figContent)
    const image = wrapper.find(ImageTag)
    expect(image).toHaveLength(1)
    const imageContent = content[0].c[0].c
    expect(image.prop('data')).toEqual(imageContent)
  })
})
