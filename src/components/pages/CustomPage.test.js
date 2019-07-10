import React from 'react'
import { shallow } from 'enzyme'

import makeContentPage from './makeContentPage'
import CustomPage from './CustomPage'
import { PageContent } from '../content'
import { loadPage, loadPageFailure } from '../../store/actions/content'

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
