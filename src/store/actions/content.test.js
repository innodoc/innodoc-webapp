import {
  loadManifest,
  loadManifestSuccess,
  loadManifestFailure,
  loadSection,
  loadSectionSuccess,
  loadSectionFailure,
  setContentRoot,
} from './content'

it('should dispatch LOAD_MANIFEST action', () => {
  expect(loadManifest()).toEqual({ type: 'LOAD_MANIFEST' })
})

it('should dispatch LOAD_MANIFEST_SUCCESS action', () => {
  const data = [
    {
      title: [{ t: 'Str', c: 'Foo section' }],
      id: 'foo-section',
    },
  ]
  expect(loadManifestSuccess(data)).toEqual({
    type: 'LOAD_MANIFEST_SUCCESS',
    data,
  })
})

it('should dispatch LOAD_MANIFEST_FAILURE action', () => {
  const error = { msg: 'Something went wrong!' }
  expect(loadManifestFailure(error)).toEqual({
    type: 'LOAD_MANIFEST_FAILURE',
    error,
  })
})

it('should dispatch LOAD_SECTION action', () => {
  expect(loadSection('foo/bar')).toEqual({ type: 'LOAD_SECTION', sectionId: 'foo/bar' })
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

it('should dispatch SET_CONTENT_ROOT action', () => {
  expect(setContentRoot('https://content.example.com/')).toEqual({
    type: 'SET_CONTENT_ROOT',
    contentRoot: 'https://content.example.com/',
  })
})
