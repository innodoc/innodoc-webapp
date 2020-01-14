import React from 'react'
import { mount } from 'enzyme'

import useAutoExpand from './useAutoExpand'

describe('useAutoExpand', () => {
  const setExpandedKeys = jest.fn()
  const makeComp = (currentSection, expandAll) => ({ expandedKeys = [] }) => {
    useAutoExpand(currentSection, expandAll, expandedKeys, setExpandedKeys)
    return null
  }

  beforeEach(() => {
    setExpandedKeys.mockClear()
  })

  it.each([
    ['expandAll=true', {}, true],
    ['w/o currentSection', undefined, false],
  ])('should not setExpandedKeys with %s', (_, currentSection, expandAll) => {
    const Comp = makeComp(currentSection, expandAll)
    mount(<Comp />)
    expect(setExpandedKeys).not.toBeCalled()
  })

  it('should add currentSection and all parents to expandedKeys', () => {
    const Comp = makeComp('foo/bar/baz/qux', false)
    mount(<Comp />)
    expect(setExpandedKeys).toBeCalledTimes(1)
    const newExpandedKeys = setExpandedKeys.mock.calls[0][0]
    expect(newExpandedKeys).toHaveLength(4)
    expect(newExpandedKeys).toContain('foo')
    expect(newExpandedKeys).toContain('foo/bar')
    expect(newExpandedKeys).toContain('foo/bar/baz')
    expect(newExpandedKeys).toContain('foo/bar/baz/qux')
  })

  it('should not create dupes in expandedKeys', () => {
    const Comp = makeComp('foo/bar/baz', false, ['foo/bar'])
    mount(<Comp />)
    expect(setExpandedKeys).toBeCalledTimes(1)
    const newExpandedKeys = setExpandedKeys.mock.calls[0][0]
    expect(newExpandedKeys).toHaveLength(3)
    expect(newExpandedKeys).toContain('foo')
    expect(newExpandedKeys).toContain('foo/bar')
    expect(newExpandedKeys).toContain('foo/bar/baz')
  })

  it('should not setExpandedKeys if nothing changed', () => {
    const Comp = makeComp('foo/bar/baz/qux', false)
    const wrapper = mount(<Comp />)
    expect(setExpandedKeys).toBeCalledTimes(1)
    const newExpandedKeys = setExpandedKeys.mock.calls[0][0]
    expect(newExpandedKeys).toHaveLength(4)
    // force re-render
    wrapper.setProps({
      expandedKeys: ['foo', 'foo/bar', 'foo/bar/baz', 'foo/bar/baz/qux'],
    })
    expect(setExpandedKeys).toBeCalledTimes(1)
    expect(newExpandedKeys).toHaveLength(4)
  })
})
