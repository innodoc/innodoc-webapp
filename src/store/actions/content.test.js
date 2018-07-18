import {
  loadToc,
  loadTocSuccess,
  loadTocFailure,
  loadSection,
  loadSectionSuccess,
  loadSectionFailure,
} from './content'

it('should dispatch LOAD_TOC action', () => {
  expect(loadToc()).toEqual({ type: 'LOAD_TOC' })
})

it('should dispatch LOAD_TOC_SUCCESS action', () => {
  const data = [
    {
      title: [{ t: 'Str', c: 'Foo section' }],
      id: 'foo-section',
    },
  ]
  expect(loadTocSuccess(data)).toEqual({
    type: 'LOAD_TOC_SUCCESS',
    data,
  })
})

it('should dispatch LOAD_TOC_FAILURE action', () => {
  const error = { msg: 'Something went wrong!' }
  expect(loadTocFailure(error)).toEqual({
    type: 'LOAD_TOC_FAILURE',
    error,
  })
})

it('should dispatch LOAD_SECTION action', () => {
  expect(loadSection()).toEqual({ type: 'LOAD_SECTION' })
})

it('should dispatch LOAD_SECTION_SUCCESS action', () => {
  const data = [{ t: 'Str', c: 'Foo string' }]
  expect(loadSectionSuccess(data)).toEqual({
    type: 'LOAD_SECTION_SUCCESS',
    data,
  })
})

it('should dispatch LOAD_SECTION_FAILURE action', () => {
  const error = { msg: 'Something went wrong!' }
  expect(loadSectionFailure(error)).toEqual({
    type: 'LOAD_SECTION_FAILURE',
    error,
  })
})
