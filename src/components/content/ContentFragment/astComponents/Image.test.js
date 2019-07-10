import React from 'react'
import { shallow } from 'enzyme'

import Image from './Image'

jest.mock('react-redux', () => ({
  useSelector: () => ({
    staticRoot: 'https://foocdn.com/',
  }),
}))

const getData = (src, alt = 'Alt text') => [
  ['foo-caption', [], null],
  [{ t: 'Str', c: 'foo content' }],
  [src, alt],
]

describe('<Image />', () => {
  it('should render', () => {
    const wrapper = shallow(<Image data={getData('test.png')} />)
    const image = wrapper.find('img')
    expect(image).toHaveLength(1)
    expect(image.prop('id')).toEqual('foo-caption')
    expect(image.prop('alt')).toBe('Alt text')
  })

  it.each([
    ['test.png', 'https://foocdn.com/test.png'],
    ['https://example.com/img.jpg', 'https://example.com/img.jpg'],
  ])('should prefix staticRoot (%s -> %s)', (orig, generated) => {
    const wrapper = shallow(<Image data={getData(orig)} />)
    expect(wrapper.find('img').prop('src')).toBe(generated)
  })

  it('should generate alt from content', () => {
    const wrapper = shallow(<Image data={getData('test.png', null)} />)
    expect(wrapper.find('img').prop('alt')).toBe('foo content')
  })
})
