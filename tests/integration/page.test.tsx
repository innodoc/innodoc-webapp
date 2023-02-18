import { locale, render, screen, store } from '#test-utils'

import { Page as ContentPage } from '#pages/page/index.page'
import fetchContent from '#renderer/fetchContent'
import pages from '#store/slices/entities/pages'
import { changeCurrentPageSlug } from '#store/slices/uiSlice'

test('<ContentPage />', async () => {
  await fetchContent(
    store,
    pages.endpoints.getPageContent.initiate({ courseId: 0, locale, pageId: 0 })
  )
  store.dispatch(changeCurrentPageSlug('home'))

  render(<ContentPage />)
  expect(screen.getAllByText(/home page/i)[0]).toBeInTheDocument()
  expect(screen.getAllByText(/this is the start of the journey/i)[0]).toBeInTheDocument()

  const linkEl = screen.getAllByRole('link', { name: 'example link' }).at(0)
  expect(linkEl).toHaveAttribute('href', 'https://www.example.com/')

  const linkElRef = screen.getAllByRole('link', { name: 'example link reference' }).at(0)
  expect(linkElRef).toHaveAttribute('href', 'https://www.example.com/reference')
})
