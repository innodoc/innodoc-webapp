import React from 'react'
import { shallow } from 'enzyme'

import makeContentPage from './makeContentPage'
import SectionPage from './SectionPage'
import { SectionContent } from '../content'
import { loadSection, loadSectionFailure } from '../../store/actions/content'

jest.mock('./makeContentPage', () => jest.fn(() => ''))

describe('<SectionPage />', () => {
  it('should makeContentPage', () => {
    shallow(<SectionPage />)
    expect(makeContentPage).toBeCalledWith(SectionContent, loadSection, loadSectionFailure)
  })
})
