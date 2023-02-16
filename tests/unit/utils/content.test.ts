import { getSectionNumberFromOrder, formatSectionTitle } from '#utils/content'

const section = {
  id: 0,
  slug: 'foo',
  path: 'bar/foo',
  courseId: 0,
  parentId: null,
  type: 'regular' as const,
  order: [0, 1],
  createdAt: '2000-01-01T01:01:01.0000Z' as const,
  updatedAt: '2000-01-01T01:01:01.0000Z' as const,
  title: 'FooFooFoo',
  shortTitle: 'Foo',
}

test('formatSectionTitle', () => {
  expect(formatSectionTitle(section)).toBe('1.2 FooFooFoo')
  expect(formatSectionTitle(section, true)).toBe('1.2 Foo')
})

test('getSectionNumberFromOrder', () => {
  expect(getSectionNumberFromOrder(section)).toBe('1.2')
})
