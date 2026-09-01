/* oxlint-disable react/react-compiler -- the probe writes the hook result to a module variable during
render; a test-only capture pattern, the component never renders UI */
import { expect, test } from 'vitest'
import type { CourseRouteInfo } from '@innodoc/shared-core/types'
import { act, createTestHarness, TEST_COURSE_SLUG } from '@innodoc/ui-test-utils'
import useManageExpanded from './use-manage-expanded.js'

// The harness starts on the course index route (no section path)
function sectionRoute(sectionPath: string): CourseRouteInfo<'app:course:section'> {
  return {
    courseSlug: TEST_COURSE_SLUG,
    locale: 'en',
    name: 'app:course:section',
    sectionPath,
  }
}

const seen: ReturnType<typeof useManageExpanded>[] = []

function Probe() {
  seen.push(useManageExpanded())
  return null
}

test('selectedItems keeps its reference across re-renders on a section route', () => {
  const harness = createTestHarness()
  harness.setRoute(sectionRoute('intro/subsection'))

  const { rerender } = harness.render(<Probe />)
  rerender(<Probe />)

  const first = seen.at(-2)
  const second = seen.at(-1)
  expect(second?.selectedItems).toStrictEqual(['intro/subsection'])
  // A fresh array per render defeats RichTreeView re-render skipping
  expect(second?.selectedItems).toBe(first?.selectedItems)
  // expandedItems is state and must stay stable as well
  expect(second?.expandedItems).toBe(first?.expandedItems)
})

test('selectedItems is empty and stable outside a section route', () => {
  const harness = createTestHarness()

  const { rerender } = harness.render(<Probe />)
  rerender(<Probe />)

  expect(seen.at(-1)?.selectedItems).toStrictEqual([])
  expect(seen.at(-1)?.selectedItems).toBe(seen.at(-2)?.selectedItems)
})

test('navigating to a section expands its parents', () => {
  const harness = createTestHarness()
  const { rerender } = harness.render(<Probe />)

  harness.setRoute(sectionRoute('intro/subsection/deeper'))
  rerender(<Probe />)

  expect(seen.at(-1)?.expandedItems).toStrictEqual(['intro', 'intro/subsection', 'intro/subsection/deeper'])
})

test('a section the user collapsed stays collapsed across re-renders', () => {
  const harness = createTestHarness()
  harness.setRoute(sectionRoute('intro/subsection'))

  const { rerender } = harness.render(<Probe />)

  act(() => {
    seen.at(-1)?.onItemExpansionToggle(null, 'intro', false)
  })
  rerender(<Probe />)

  // The re-render must not re-expand the collapsed parent
  expect(seen.at(-1)?.expandedItems).toStrictEqual(['intro/subsection'])
})
