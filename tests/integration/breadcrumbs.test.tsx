import { locale, render, screen, store, within } from '#test-utils'

import { Page as ContentSection } from '#pages/section/index.page'
import fetchContent from '#renderer/fetchContent'
import sections from '#store/slices/entities/sections'
import { changeCurrentSectionPath } from '#store/slices/uiSlice'

test('<Breadcrumbs />', async () => {
  await fetchContent(
    store,
    sections.endpoints.getSectionContent.initiate({ courseId: 0, locale, sectionId: 27 })
  )
  store.dispatch(
    changeCurrentSectionPath(
      'eaque-inventore-non/sapiente-similique-id/maxime-sed-voluptatum/mollitia-neque-vitae'
    )
  )

  render(<ContentSection />)
  const main = screen.getByRole('main')
  const breadcrumbs = within(main).getByRole('navigation')

  const homeLink = within(breadcrumbs).getByRole('link', {
    name: 'internalPages.home.title',
    exact: true,
  })
  expect(homeLink).toHaveAttribute('href', '/en/pagetest/home')

  const firstLink = within(breadcrumbs).getByRole('link', {
    name: '3 Eaque inventore',
    exact: true,
  })
  expect(firstLink).toHaveAttribute('href', '/en/sectiontest/eaque-inventore-non')

  const secondLink = within(breadcrumbs).getByRole('link', {
    name: '3.3 Sapiente similique',
    exact: true,
  })
  expect(secondLink).toHaveAttribute(
    'href',
    '/en/sectiontest/eaque-inventore-non/sapiente-similique-id'
  )

  const thirdLink = within(breadcrumbs).getByRole('link', { name: '3.3.1 Maxime sed', exact: true })
  expect(thirdLink).toHaveAttribute(
    'href',
    '/en/sectiontest/eaque-inventore-non/sapiente-similique-id/maxime-sed-voluptatum'
  )

  const sectionLabel = within(breadcrumbs).getByText('3.3.1.1 Mollitia neque', { exact: true })
  expect(sectionLabel).toBeInTheDocument()
})
