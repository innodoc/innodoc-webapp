/* oxlint-disable react/react-compiler -- the probes write the hook results to module variables during
render; a test-only capture pattern, the components never render UI */
/* oxlint-disable vitest/warn-todo -- the `.todo` entries below are deliberate gates on fixes
still landing in parallel; un-gate each (todo → test) when its fix is on `dev`, per the file header */

/**
 * Referential-stability guardrail for the store hooks.
 *
 * A hook whose selector is rebuilt per render - or whose result is a fresh array - fails the
 * assertions below: with unchanged route and store data, re-renders must hand back the same
 * references. That is what lets `React.memo` children and RTK Query's `shallowEqual` gate bail
 * out. The full acceptance test per hook:
 *
 *   createTestHarness() → await harness.withCourse() → render a probe that calls the hook and
 *   pushes its result → rerender twice → expect the results to be `toBe`-equal across renders.
 *
 * The active tests cover the hooks that are already stable. The `test.todo` entry gates the fix
 * still landing in parallel - un-gate it (todo → test) when it is on `dev`; the body is kept
 * type-checked so un-gating is a one-word change:
 *
 * - share one module-scope selector instance across consumers in useSelectCurrentCourse
 */
import { expect, test } from 'vitest'
import type { TranslatedCourse, TranslatedPage, TranslatedSection } from '@innodoc/shared-core/types'
import { createTestHarness } from '@innodoc/ui-test-utils'
import useSelectCurrentCourse from './use-select-current-course.js'
import useSelectLinkedPages from './use-select-linked-pages.js'
import useSelectSectionChildren from './use-select-section-children.js'
import useSelectSectionTree from './use-select-section-tree.js'

const childrenSeen: { sections: readonly TranslatedSection[] }[] = []
function ChildrenProbe() {
  childrenSeen.push(useSelectSectionChildren(null))
  return null
}

const treeSeen: ReturnType<typeof useSelectSectionTree>[] = []
function TreeProbe() {
  treeSeen.push(useSelectSectionTree(null))
  return null
}

const courseA: { course?: TranslatedCourse }[] = []
function CourseProbeA() {
  courseA.push(useSelectCurrentCourse())
  return null
}

const courseB: { course?: TranslatedCourse }[] = []
function CourseProbeB() {
  courseB.push(useSelectCurrentCourse())
  return null
}

function DualCourseProbe() {
  return (
    <>
      <CourseProbeA />
      <CourseProbeB />
    </>
  )
}

const linkedPagesA: { pages: readonly TranslatedPage[] }[] = []
function LinkedPagesProbeA() {
  linkedPagesA.push(useSelectLinkedPages('nav'))
  return null
}

const linkedPagesB: { pages: readonly TranslatedPage[] }[] = []
function LinkedPagesProbeB() {
  linkedPagesB.push(useSelectLinkedPages('nav'))
  return null
}

function DualLinkedPagesProbe() {
  return (
    <>
      <LinkedPagesProbeA />
      <LinkedPagesProbeB />
    </>
  )
}

test('useSelectCurrentCourse keeps the course reference across re-renders', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  courseA.length = 0
  const { rerender } = harness.render(<CourseProbeA />)
  rerender(<CourseProbeA />)

  expect(courseA).toHaveLength(2)
  expect(courseA.at(1)?.course).toBeDefined()
  expect(courseA.at(1)?.course).toBe(courseA.at(0)?.course)
})

test('useSelectLinkedPages keeps the pages reference across re-renders', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  linkedPagesA.length = 0
  const { rerender } = harness.render(<LinkedPagesProbeA />)
  rerender(<LinkedPagesProbeA />)

  expect(linkedPagesA).toHaveLength(2)
  expect(linkedPagesA.at(1)?.pages).toBeDefined()
  expect(linkedPagesA.at(1)?.pages).toBe(linkedPagesA.at(0)?.pages)
})

// useSelectSectionChildren's selector is at module scope, so rerenders hit the warm cache and
// must return the same array.
test('useSelectSectionChildren keeps its result reference across re-renders', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  childrenSeen.length = 0
  const { rerender } = harness.render(<ChildrenProbe />)
  rerender(<ChildrenProbe />)

  expect(childrenSeen).toHaveLength(2)
  expect(childrenSeen.at(1)?.sections).toBe(childrenSeen.at(0)?.sections)
})

// useSelectSectionTree's selector is at module scope and the array tail no longer runs outside
// every memo.
test('useSelectSectionTree keeps its result reference across re-renders', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  treeSeen.length = 0
  const { rerender } = harness.render(<TreeProbe />)
  rerender(<TreeProbe />)

  expect(treeSeen).toHaveLength(2)
  // The array tail (Object.entries(...).filter(...).toSorted(...).map(...)) must not run outside
  // every memo, handing out a fresh array on every render.
  expect(treeSeen.at(1)).toBe(treeSeen.at(0))
})

// Fails until the parallel fix lands: each component instance builds its own selector, so two
// consumers of the same course get two distinct translated objects. Two probes stand in for
// the app's five consumers (Logo, MetaTags, MenuItemsLanguages, CourseHomeLink, Footer).
test.todo('useSelectCurrentCourse shares one course object across consumers (un-gate when the fix lands)', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  courseA.length = 0
  courseB.length = 0
  harness.render(<DualCourseProbe />)

  expect(courseA.at(-1)?.course).toBeDefined()
  expect(courseA.at(-1)?.course).toBe(courseB.at(-1)?.course)
})

// The page hooks share one module-scope selector, so two consumers of the same slot get the
// same page array.
test('useSelectLinkedPages shares one page array across consumers of the same slot', async () => {
  const harness = createTestHarness()
  await harness.withCourse()

  linkedPagesA.length = 0
  linkedPagesB.length = 0
  harness.render(<DualLinkedPagesProbe />)

  expect(linkedPagesA.at(-1)?.pages).toBeDefined()
  expect(linkedPagesA.at(-1)?.pages).toBe(linkedPagesB.at(-1)?.pages)
})
