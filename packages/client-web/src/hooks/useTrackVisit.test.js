import React from 'react'
import { mount } from 'enzyme'

import { sectionVisit } from '@innodoc/client-store/src/actions/content'

import useTrackVisit from './useTrackVisit'

const mockDispatch = jest.fn()
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
}))

const Component = ({ sectionId }) => {
  useTrackVisit(sectionId)
  return <div />
}

describe('useTrackVisit', () => {
  beforeEach(() => jest.clearAllMocks())

  it('should dispatch sectionVisit', () => {
    mount(<Component sectionId="foo" />)
    expect(mockDispatch).toBeCalledWith(sectionVisit('foo'))
  })

  it('should not dispatch w/o sectionId', () => {
    mount(<Component />)
    expect(mockDispatch).not.toBeCalled()
  })
})
