import {
  actionTypes,
  loadManifest,
  loadManifestFailure,
  loadManifestSuccess,
  loadPage,
  loadPageFailure,
  loadPageSuccess,
  loadSection,
  loadSectionFailure,
  loadSectionSuccess,
  setContentRoot,
  setStaticRoot,
} from './content'

it('should dispatch LOAD_MANIFEST action', () => {
  expect(loadManifest()).toEqual({ type: actionTypes.LOAD_MANIFEST })
})

it('should dispatch LOAD_MANIFEST_SUCCESS action', () => {
  const data = [
    {
      title: [{ t: 'Str', c: 'Foo section' }],
      id: 'foo-section',
    },
  ]
  expect(loadManifestSuccess(data)).toEqual({
    type: actionTypes.LOAD_MANIFEST_SUCCESS,
    data,
  })
})

it('should dispatch LOAD_MANIFEST_FAILURE action', () => {
  const error = { msg: 'Something went wrong!' }
  expect(loadManifestFailure(error)).toEqual({
    type: actionTypes.LOAD_MANIFEST_FAILURE,
    error,
  })
})

it('should dispatch LOAD_PAGE action', () => {
  expect(loadPage('foo', 'en')).toEqual({
    type: actionTypes.LOAD_PAGE,
    prevLanguage: 'en',
    contentId: 'foo',
  })
})

it('should dispatch LOAD_PAGE_SUCCESS action', () => {
  const data = [{ t: 'Str', c: 'Foo string' }]
  expect(loadPageSuccess(data)).toEqual({
    type: actionTypes.LOAD_PAGE_SUCCESS,
    data,
  })
})

it('should dispatch LOAD_PAGE_FAILURE action', () => {
  const error = { msg: 'Something went wrong!' }
  expect(loadPageFailure(error)).toEqual({
    type: actionTypes.LOAD_PAGE_FAILURE,
    error,
  })
})

it('should dispatch LOAD_SECTION action', () => {
  expect(loadSection('foo/bar', 'en')).toEqual({
    type: actionTypes.LOAD_SECTION,
    prevLanguage: 'en',
    contentId: 'foo/bar',
  })
})

it('should dispatch LOAD_SECTION_SUCCESS action', () => {
  const data = [{ t: 'Str', c: 'Foo string' }]
  expect(loadSectionSuccess(data)).toEqual({
    type: actionTypes.LOAD_SECTION_SUCCESS,
    data,
  })
})

it('should dispatch LOAD_SECTION_FAILURE action', () => {
  const error = { msg: 'Something went wrong!' }
  expect(loadSectionFailure(error)).toEqual({
    type: actionTypes.LOAD_SECTION_FAILURE,
    error,
  })
})

it('should dispatch SET_CONTENT_ROOT action', () => {
  expect(setContentRoot('https://content.example.com/')).toEqual({
    type: actionTypes.SET_CONTENT_ROOT,
    contentRoot: 'https://content.example.com/',
  })
})

it('should dispatch SET_STATIC_ROOT action', () => {
  expect(setStaticRoot('https://cdn.example.com/')).toEqual({
    type: actionTypes.SET_STATIC_ROOT,
    staticRoot: 'https://cdn.example.com/',
  })
})
