import { loadSection, render, screen } from '#test-utils'

import { Page as ContentSection } from '#pages/section/index.page'

test('<ContentSection />', async () => {
  await loadSection('tempore-ut-id')

  render(<ContentSection />)

  expect(screen.getByRole('heading', { name: '1 Tempore ut id', exact: true })).toBeInTheDocument()
  expect(screen.getByText(/Nesciunt possimus dolores molestias/)).toBeInTheDocument()
  expect(screen.getByText(/Vero impedit quas fugiat facilis/)).toBeInTheDocument()
})
