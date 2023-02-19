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
  expect(screen.getByRole('heading', { name: 'Home page', exact: true })).toBeInTheDocument()
  expect(screen.getByText(/this is the start of the journey/i)).toBeInTheDocument()

  const linkEl = screen.getByRole('link', { name: 'example link' })
  expect(linkEl).toHaveAttribute('href', 'https://www.example.com/')

  const linkElRef = screen.getByRole('link', { name: 'example link reference' })
  expect(linkElRef).toHaveAttribute('href', 'https://www.example.com/reference')
})
