import { translateEntity } from '#utils/i18n'

test('translateEntity', () => {
  const obj = {
    id: 0,
    createdAt: '2000-01-01T01:01:01.0000Z' as const,
    updatedAt: '2000-01-01T01:01:01.0000Z' as const,
    title: {
      de: 'Foo DE',
      en: 'Foo EN',
    },
  }

  expect(translateEntity(obj, ['title'], 'de')).toEqual({
    id: 0,
    createdAt: '2000-01-01T01:01:01.0000Z' as const,
    updatedAt: '2000-01-01T01:01:01.0000Z' as const,
    title: 'Foo DE',
  })
  expect(translateEntity(obj, ['title'], 'en')).toEqual({
    id: 0,
    createdAt: '2000-01-01T01:01:01.0000Z' as const,
    updatedAt: '2000-01-01T01:01:01.0000Z' as const,
    title: 'Foo EN',
  })
})
