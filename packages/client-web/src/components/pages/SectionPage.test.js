import React from 'react'
import { shallow } from 'enzyme'

import {
  loadSection,
  loadSectionFailure,
} from '@innodoc/client-store/src/actions/content'

import makeContentPage from './makeContentPage'
import SectionPage from './SectionPage'
import { SectionContent } from '../content'

jest.mock('./makeContentPage', () => jest.fn(() => ''))

describe('<SectionPage />', () => {
  it('should makeContentPage', () => {
    shallow(<SectionPage />)
    expect(makeContentPage).toBeCalledWith(
      SectionContent,
      loadSection,
      loadSectionFailure
    )
  })
})
