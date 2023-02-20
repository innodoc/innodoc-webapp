import { loadSection, render, screen, within } from '#test-utils'

import { Page as ContentSection } from '#pages/section/index.page'

test('<Breadcrumbs />', async () => {
  await loadSection(
    'eaque-inventore-non/sapiente-similique-id/maxime-sed-voluptatum/mollitia-neque-vitae'
  )

  render(<ContentSection />)
  const main = screen.getByRole('main')
  const breadcrumbs = within(main).getByRole('navigation')

  const homeLink = within(breadcrumbs).getByRole('link', {
    name: 'internalPages.home.title',
  })
  expect(homeLink).toHaveAttribute('href', '/en/pagetest/home')

  const firstLink = within(breadcrumbs).getByRole('link', {
    name: '3 Eaque inventore',
  })
  expect(firstLink).toHaveAttribute('href', '/en/sectiontest/eaque-inventore-non')

  const secondLink = within(breadcrumbs).getByRole('link', {
    name: '3.3 Sapiente similique',
  })
  expect(secondLink).toHaveAttribute(
    'href',
    '/en/sectiontest/eaque-inventore-non/sapiente-similique-id'
  )

  const thirdLink = within(breadcrumbs).getByRole('link', { name: '3.3.1 Maxime sed' })
  expect(thirdLink).toHaveAttribute(
    'href',
    '/en/sectiontest/eaque-inventore-non/sapiente-similique-id/maxime-sed-voluptatum'
  )

  await within(breadcrumbs).findByText('3.3.1.1 Mollitia neque')
})
