import { assert, expect, test } from 'vitest'

import { populateStore, render, screen, within } from '@innodoc/rtl'

import { StaticToc } from '#toc'

test('renders StaticToc', async () => {
  await populateStore()

  render(<StaticToc />)

  expect(screen.getAllByRole('link')).toHaveLength(3)

  const list = screen.getAllByRole('list').at(0)
  assert(list, 'list not found')

  const [item1, , item3] = within(list).getAllByRole('listitem')
  assert(item1, 'list item found')
  assert(item3, 'list item found')

  const [section1, sectionA] = within(item1).getAllByRole('link')
  expect(section1).toHaveTextContent('1 Course section 1')
  expect(sectionA).toHaveTextContent('1.1 Course section A')

  expect(within(item3).getByRole('link')).toHaveTextContent('2 Course section 2')
})
