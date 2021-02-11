import {
  actionTypes,
  changeCourse,
  contentNotFound,
  loadFragment,
  loadFragmentFailure,
  loadFragmentSuccess,
  loadManifest,
  loadManifestFailure,
  loadManifestSuccess,
  loadPage,
  loadPageFailure,
  loadPageSuccess,
  loadSection,
  loadSectionFailure,
  loadSectionSuccess,
  routeChangeStart,
  sectionVisit,
  setServerConfiguration,
} from './content'

test('CHANGE_COURSE action', () => {
  const course = { id: 0 }
  expect(changeCourse(course)).toEqual({
    type: actionTypes.CHANGE_COURSE,
    course,
  })
})

test('CONTENT_NOT_FOUND action', () => {
  expect(contentNotFound()).toEqual({
    type: actionTypes.CONTENT_NOT_FOUND,
  })
})

test('LOAD_FRAGMENT action', () => {
  expect(loadFragment('foo')).toEqual({
    type: actionTypes.LOAD_FRAGMENT,
    contentId: 'foo',
  })
})

test('LOAD_FRAGMENT_SUCCESS action', () => {
  const data = { fragment: 'data' }
  expect(loadFragmentSuccess(data)).toEqual({
    type: actionTypes.LOAD_FRAGMENT_SUCCESS,
    data,
  })
})

test('LOAD_FRAGMENT_FAILURE action', () => {
  const error = new Error('Test')
  expect(loadFragmentFailure(error)).toEqual({
    type: actionTypes.LOAD_FRAGMENT_FAILURE,
    error,
  })
})

test('LOAD_MANIFEST action', () => {
  expect(loadManifest()).toEqual({ type: actionTypes.LOAD_MANIFEST })
})

test('LOAD_MANIFEST_SUCCESS action', () => {
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

test('LOAD_MANIFEST_FAILURE action', () => {
  const error = new Error('Something went wrong!')
  expect(loadManifestFailure(error)).toEqual({
    type: actionTypes.LOAD_MANIFEST_FAILURE,
    error,
  })
})

test('LOAD_PAGE action', () => {
  expect(loadPage('foo', 'en')).toEqual({
    type: actionTypes.LOAD_PAGE,
    prevLanguage: 'en',
    contentId: 'foo',
  })
})

test('LOAD_PAGE_SUCCESS action', () => {
  const data = [{ t: 'Str', c: 'Foo string' }]
  expect(loadPageSuccess(data)).toEqual({
    type: actionTypes.LOAD_PAGE_SUCCESS,
    data,
  })
})

test('LOAD_PAGE_FAILURE action', () => {
  const error = new Error('Something went wrong!')
  expect(loadPageFailure(error)).toEqual({
    type: actionTypes.LOAD_PAGE_FAILURE,
    error,
  })
})

test('LOAD_SECTION action', () => {
  expect(loadSection('foo/bar', 'en')).toEqual({
    type: actionTypes.LOAD_SECTION,
    prevLanguage: 'en',
    contentId: 'foo/bar',
  })
})

test('LOAD_SECTION_SUCCESS action', () => {
  const data = [{ t: 'Str', c: 'Foo string' }]
  expect(loadSectionSuccess(data)).toEqual({
    type: actionTypes.LOAD_SECTION_SUCCESS,
    data,
  })
})

test('LOAD_SECTION_FAILURE action', () => {
  const error = new Error('Something went wrong!')
  expect(loadSectionFailure(error)).toEqual({
    type: actionTypes.LOAD_SECTION_FAILURE,
    error,
  })
})

test('ROUTE_CHANGE_START action', () => {
  expect(routeChangeStart()).toEqual({
    type: actionTypes.ROUTE_CHANGE_START,
  })
})

test('SECTION_VISIT action', () =>
  expect(sectionVisit('foo/bar')).toEqual({
    type: 'SECTION_VISIT',
    sectionId: 'foo/bar',
  }))

test('SET_SERVER_CONFIGURATION action', () => {
  expect(
    setServerConfiguration(
      'https://app.example.com/',
      'https://content.example.com/',
      'https://discourse.example.com/',
      false,
      'https://cdn.example.com/',
      '123csrfToken!',
      'section',
      'page',
      'content.pdf'
    )
  ).toEqual({
    type: actionTypes.SET_SERVER_CONFIGURATION,
    config: {
      appRoot: 'https://app.example.com/',
      contentRoot: 'https://content.example.com/',
      discourseUrl: 'https://discourse.example.com/',
      ftSearchEnabled: false,
      csrfToken: '123csrfToken!',
      pagePathPrefix: 'page',
      pdfFilename: 'content.pdf',
      sectionPathPrefix: 'section',
      staticRoot: 'https://cdn.example.com/',
    },
  })
})
