import { assert, expect, test } from 'vitest'

import { populateStore, render, screen, within } from '@innodoc/rtl'

import { StaticToc } from '#toc'

test('renders StaticToc', async () => {
  await populateStore()

  render(<StaticToc />)

  expect(screen.getAllByRole('link')).toHaveLength(84)

  // 1st section (no children)
  const firstItem = screen.getAllByRole('listitem').at(0)
  assert(firstItem, 'firstItem not found')
  const firstSection = within(firstItem).getAllByRole('link')
  expect(firstSection).toHaveLength(1)
  expect(firstSection.at(0)).toHaveTextContent('1 Tabesco cilicium soluta')

  // 2nd section (4 children)
  const secondItem = screen.getAllByRole('listitem').at(1)
  assert(secondItem, 'secondItem not found')
  const subSections = within(secondItem).getAllByRole('link')
  expect(subSections).toHaveLength(5)
  const [secondSection, subSection1, subSection2, subSection3, subSection4] = subSections
  expect(secondSection).toHaveTextContent('2 Ut aggredior vix')
  expect(subSection1).toHaveTextContent('2.1 Demulceo cito dolorem')
  expect(subSection2).toHaveTextContent('2.2 Tondeo crur caritas')
  expect(subSection3).toHaveTextContent('2.3 Vel decet terreo')
  expect(subSection4).toHaveTextContent('2.4 Celebrer clarus atqui')
})
