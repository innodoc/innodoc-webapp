import {
  act,
  fireEvent,
  loadSection,
  render,
  screen,
  waitFor,
  waitForElementToBeRemoved,
  within,
} from '#test-utils'

import { Page as ContentSection } from '#pages/section/index.page'

test('<Toc />', async () => {
  await loadSection(
    'eaque-inventore-non/sapiente-similique-id/maxime-sed-voluptatum/mollitia-neque-vitae'
  )

  render(<ContentSection />)

  // Open Toc in sidebar
  fireEvent.click(screen.getByRole('button', { name: 'internalPages.toc.title' }))
  const toc = await screen.findByTestId('sidebar-toc')

  // Count section links
  expect(within(toc).getAllByRole('link')).toHaveLength(16)
  const sectionLink = within(toc).getByRole('link', { name: '3.3.1.1 Mollitia neque' })
  expect(sectionLink).toBeInTheDocument()

  // Collapse third section
  const thirdSecLink = within(toc).getByRole('link', { name: /3 eaque inventore/i })
  const thirdSecCollapsBtn = within(thirdSecLink).getByRole('button', {
    name: 'toc.collapseSection',
  })
  fireEvent.click(thirdSecCollapsBtn)
  await waitForElementToBeRemoved(sectionLink)
  expect(within(toc).getAllByRole('link')).toHaveLength(7)

  // Navigate to another deep section and assert sections are expanding properly
  const path =
    'eaque-inventore-non/sapiente-similique-id/explicabo-doloremque-esse/laboriosam-similique-quidem'
  await act(() => loadSection(path))
  await waitFor(() => {
    expect(within(toc).getAllByRole('link')).toHaveLength(17)
  })
  await within(toc).findByRole('link', { name: '3.3.1.1 Mollitia neque' })
  await within(toc).findByRole('link', { name: '3.3.2.1 Laboriosam similique' })

  // Close Toc sidebar
  fireEvent.click(screen.getByRole('button', { name: /close/i }))
  await waitFor(() => {
    expect(toc).not.toBeVisible()
  })
})
