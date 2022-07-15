import React from 'react'
import { mount } from 'enzyme'

import useAutoExpand from './useAutoExpand'

describe('useAutoExpand', () => {
  const setExpandedKeys = jest.fn()
  const makeComp =
    (expandAll) =>
    ({ currentSectionId, expandedKeys = new Set() }) => {
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
    const Comp = makeComp(expandAll)
    mount(<Comp currentSectionId={currentSectionId} />)
    expect(setExpandedKeys).not.toBeCalled()
  })

  it('should add currentSectionId and all parents IDs to expandedKeys', () => {
    const Comp = makeComp(false)
    mount(<Comp currentSectionId="foo/bar/baz/qux" />)
    expect(setExpandedKeys).toBeCalledTimes(1)
    const newExpandedKeys = setExpandedKeys.mock.calls[0][0]
    expect(newExpandedKeys.size).toBe(4)
    expect(newExpandedKeys).toContain('foo')
    expect(newExpandedKeys).toContain('foo/bar')
    expect(newExpandedKeys).toContain('foo/bar/baz')
    expect(newExpandedKeys).toContain('foo/bar/baz/qux')
  })

  it('should only add current keys if section changed', () => {
    const Comp = makeComp(false)
    const wrapper = mount(<Comp currentSectionId="foo/bar/baz" />)

    expect(setExpandedKeys).toBeCalledTimes(1)
    const newExpandedKeys = setExpandedKeys.mock.calls[0][0]
    expect(newExpandedKeys.size).toBe(3)
    expect(newExpandedKeys).toContain('foo')
    expect(newExpandedKeys).toContain('foo/bar')
    expect(newExpandedKeys).toContain('foo/bar/baz')

    wrapper.setProps({ expandedKeys: new Set() }) // forces re-render
    expect(setExpandedKeys).toBeCalledTimes(1)

    wrapper.setProps({ currentSectionId: 'qux/bar' })
    expect(setExpandedKeys).toBeCalledTimes(2)

    const updatedExpandedKeys = setExpandedKeys.mock.calls[1][0]
    expect(updatedExpandedKeys.size).toBe(2)
    expect(updatedExpandedKeys).toContain('qux')
    expect(updatedExpandedKeys).toContain('qux/bar')
  })
})
