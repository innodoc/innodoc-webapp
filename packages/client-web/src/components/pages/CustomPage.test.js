import React from 'react'
import { shallow } from 'enzyme'

import { loadPage, loadPageFailure } from '@innodoc/client-store/src/actions/content'

import makeContentPage from './makeContentPage'
import CustomPage from './CustomPage'
import { PageContent } from '../content'

jest.mock('./makeContentPage', () => jest.fn(() => ''))

describe('<CustomPage />', () => {
  it('should makeContentPage', () => {
    shallow(<CustomPage />)
    expect(makeContentPage).toBeCalledWith(
      PageContent,
      loadPage,
      loadPageFailure
    )
  })
})
