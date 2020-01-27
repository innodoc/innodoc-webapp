import React from 'react'
import { mount } from 'enzyme'

import useAutoExpand from './useAutoExpand'

describe('useAutoExpand', () => {
  const setExpandedKeys = jest.fn()
  const makeComp = (currentSectionId, expandAll) => ({ expandedKeys = [] }) => {
    useAutoExpand(currentSectionId, expandAll, expandedKeys, setExpandedKeys)
    return null
  }

  beforeEach(() => {
    setExpandedKeys.mockClear()
  })

  it.each([
    ['expandAll=true', 'foo/bar', true],
    ['w/o currentSectionId', undefined, false],
  ])('should not setExpandedKeys with %s', (_, currentSectionId, expandAll) => {
    const Comp = makeComp(currentSectionId, expandAll)
    mount(<Comp />)
    expect(setExpandedKeys).not.toBeCalled()
  })

  it('should add currentSectionId and all parents IDs to expandedKeys', () => {
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
