import React from 'react'
import { shallow } from 'enzyme'

import ContentFragment from '../../ContentFragment'
import { Image } from './Image'

describe('render', () => {
  const language = 'en'
  const contentRoot = '/root/'
  const course = {
    currentSectionId: 'foo',
  }

  test('render with caption and relative link', () => {
    const data = [
      ['', ['class1', 'class2'], []],
      [
        {
          t: 'Str',
          c: 'Foo',
        },
      ],
      ['imageSrc', 'imageAlt'],
    ]
    const wrapper = shallow(
      <Image contentRoot={contentRoot} course={course} data={data} language={language} />
    )

    const spans = wrapper.find('span')
    expect(spans).toHaveLength(2)
    const outerSpan = spans.at(0)
    expect(outerSpan.prop('className')).toEqual('imageContainer')

    const caption = spans.at(1)
    expect(caption.prop('className')).toEqual('imageCaption')

    const content = caption.find(ContentFragment)
    expect(content).toHaveLength(1)
    expect(content.at(0).prop('content')).toBe(data[1])

    let img = wrapper.find('img')
    expect(img).toHaveLength(1)
    img = img.at(0)
    expect(img.prop('src')).toEqual(`${contentRoot}_static/${course.currentSectionId}/${data[2][0]}`)
    expect(img.prop('alt')).toBe(data[2][1])
  })

  test('render without caption and relative link', () => {
    const data = [
      ['', ['class1', 'class2'], []],
      [],
      ['imageSrc', 'imageAlt'],
    ]
    const wrapper = shallow(
      <Image contentRoot={contentRoot} course={course} data={data} language={language} />
    )

    const spans = wrapper.find('span')
    expect(spans).toHaveLength(0)

    let img = wrapper.find('img')
    expect(img).toHaveLength(1)
    img = img.at(0)
    expect(img.prop('src')).toEqual(`${contentRoot}_static/${course.currentSectionId}/${data[2][0]}`)
    expect(img.prop('alt')).toBe(data[2][1])
  })

  test('render without caption and url', () => {
    const data = [
      ['', ['class1', 'class2'], []],
      [],
      ['http://example.com', 'imageAlt'],
    ]
    const wrapper = shallow(
      <Image contentRoot={contentRoot} course={course} data={data} language={language} />
    )

    const spans = wrapper.find('span')
    expect(spans).toHaveLength(0)

    let img = wrapper.find('img')
    expect(img).toHaveLength(1)
    img = img.at(0)
    expect(img.prop('src')).toEqual(data[2][0])
    expect(img.prop('alt')).toBe(data[2][1])
  })

  test('render without caption and absolute link', () => {
    const data = [
      ['', ['class1', 'class2'], []],
      [],
      ['/foo/bar/image', 'imageAlt'],
    ]
    const wrapper = shallow(
      <Image contentRoot={contentRoot} course={course} data={data} language={language} />
    )

    const spans = wrapper.find('span')
    expect(spans).toHaveLength(0)

    let img = wrapper.find('img')
    expect(img).toHaveLength(1)
    img = img.at(0)
    expect(img.prop('src')).toEqual(`${contentRoot}_static${data[2][0]}`)
    expect(img.prop('alt')).toBe(data[2][1])
  })

  test('render without caption and url and localized', () => {
    const data = [
      ['', ['class1', 'class2', 'localized'], []],
      [],
      ['http://example.com', 'imageAlt'],
    ]
    const wrapper = shallow(
      <Image contentRoot={contentRoot} course={course} data={data} language={language} />
    )

    const spans = wrapper.find('span')
    expect(spans).toHaveLength(0)

    let img = wrapper.find('img')
    expect(img).toHaveLength(1)
    img = img.at(0)
    expect(img.prop('src')).toEqual(data[2][0])
    expect(img.prop('alt')).toBe(data[2][1])
  })

  test('render without caption and relative and localized', () => {
    const data = [
      ['', ['class1', 'class2', 'localized'], []],
      [],
      ['imageSrc', 'imageAlt'],
    ]
    const wrapper = shallow(
      <Image contentRoot={contentRoot} course={course} data={data} language={language} />
    )

    const spans = wrapper.find('span')
    expect(spans).toHaveLength(0)

    let img = wrapper.find('img')
    expect(img).toHaveLength(1)
    img = img.at(0)
    expect(img.prop('src')).toEqual(`${contentRoot}${language}/_static/${course.currentSectionId}/${data[2][0]}`)
    expect(img.prop('alt')).toBe(data[2][1])
  })

  test('render without caption and absolute link and localized', () => {
    const data = [
      ['', ['class1', 'class2', 'localized'], []],
      [],
      ['/foo/bar/image', 'imageAlt'],
    ]
    const wrapper = shallow(
      <Image contentRoot={contentRoot} course={course} data={data} language={language} />
    )

    const spans = wrapper.find('span')
    expect(spans).toHaveLength(0)

    let img = wrapper.find('img')
    expect(img).toHaveLength(1)
    img = img.at(0)
    expect(img.prop('src')).toEqual(`${contentRoot}${language}/_static${data[2][0]}`)
    expect(img.prop('alt')).toBe(data[2][1])
  })

  test('test classes', () => {
  })
})
