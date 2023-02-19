import { locale, render, screen, store } from '#test-utils'

import { Page as ContentSection } from '#pages/section/index.page'
import fetchContent from '#renderer/fetchContent'
import sections from '#store/slices/entities/sections'
import { changeCurrentSectionPath } from '#store/slices/uiSlice'

test('<ContentSection />', async () => {
  await fetchContent(
    store,
    sections.endpoints.getSectionContent.initiate({ courseId: 0, locale, sectionId: 0 })
  )
  store.dispatch(changeCurrentSectionPath('tempore-ut-id'))

  render(<ContentSection />)
  expect(screen.getByRole('heading', { name: '1 Tempore ut id', exact: true })).toBeInTheDocument()
  expect(screen.getByText(/Nesciunt possimus dolores molestias/)).toBeInTheDocument()
  expect(screen.getByText(/Vero impedit quas fugiat facilis/)).toBeInTheDocument()
})
