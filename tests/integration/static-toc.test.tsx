import { render, screen, within } from '#test-utils'

import { Page as StaticToc } from '#pages/toc.page'

test('<StaticToc />', () => {
  render(<StaticToc />)
  const main = screen.getByTestId('main-container')
  expect(
    within(main).getByRole('heading', { name: 'internalPages.toc.title', exact: true })
  ).toBeInTheDocument()
  expect(within(main).getAllByRole('link')).toHaveLength(84)
  expect(screen.getByRole('link', { name: '1 Tempore ut id', exact: true })).toHaveAttribute(
    'href',
    '/en/sectiontest/tempore-ut-id'
  )
  expect(
    screen.getByRole('link', { name: '3.4.1.3.3 Maxime sed voluptatum', exact: true })
  ).toHaveAttribute(
    'href',
    '/en/sectiontest/eaque-inventore-non/corporis-hic-doloribus/sequi-dignissimos-enim/sequi-dignissimos-enim/maxime-sed-voluptatum'
  )
  expect(
    screen.getByRole('link', { name: '7 Explicabo doloremque esse', exact: true })
  ).toHaveAttribute('href', '/en/sectiontest/explicabo-doloremque-esse')
})
