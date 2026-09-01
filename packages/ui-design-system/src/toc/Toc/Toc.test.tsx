import { expect, test } from 'vitest'
import { createTestHarness, screen } from '@innodoc/ui-test-utils'
import Toc from './Toc.js'

// The drawer tree view is the only consumer of useSelectSectionTree, and the one that motivated
// hoisting that selector: it receives the array the memoised selector produced - the frozen
// sentinel while a course query is skipped or loading - and must neither choke on it nor lose nodes.
// What is pinned here is the rendered tree; the fixture titles come from a seeded faker whose word
// list moves between releases, so only the shape and the numbering prefix are asserted.

test('Toc renders the top-level sections of the course as tree items', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  harness.render(<Toc />)

  const items = screen.getAllByRole('treeitem')
  expect(items).toHaveLength(7) // the fixture course serves seven top-level sections
  expect(items.map((item) => item.textContent.split(' ')[0])).toEqual(['1', '2', '3', '4', '5', '6', '7'])
})

test('Toc renders an empty tree outside a course', () => {
  const harness = createTestHarness({ routeInfo: { locale: 'en', name: 'app:index' } })

  harness.render(<Toc />)

  // the skipped query hands the view the frozen EMPTY_SECTION_TREE sentinel
  expect(screen.getByTestId('sidebar-toc')).toBeInTheDocument()
  expect(screen.queryAllByRole('treeitem')).toHaveLength(0)
})
