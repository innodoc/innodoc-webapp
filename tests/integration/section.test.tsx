import { locale, render, screen, store } from '#test-utils'

import { Page as ContentSection } from '#pages/section/index.page'
import fetchContent from '#renderer/fetchContent'
import sections from '#store/slices/entities/sections'
import { changeCurrentSectionPath } from '#store/slices/uiSlice'

beforeEach(async () => {
  await fetchContent(
    store,
    sections.endpoints.getSectionContent.initiate({ courseId: 0, locale, sectionId: 0 })
  )
  store.dispatch(changeCurrentSectionPath('ex-possimus-repellat'))
})

test('<ContentSection />', () => {
  render(<ContentSection />)
  expect(screen.getAllByText(/Ipsa soluta consequuntur sint hic recusandae/)[0]).toBeInTheDocument()
  expect(screen.getAllByText(/Quam voluptatum consequatur necessitatibus/)[0]).toBeInTheDocument()
})
