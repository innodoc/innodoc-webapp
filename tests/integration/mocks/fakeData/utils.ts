import { faker } from '@faker-js/faker'
import type { LanguageCode } from 'iso-639-1'
import type { CamelCase } from 'type-fest'

import type { DbDefaultTranslatableFields, TranslatableFields } from '#types/entities/base'

type Titles = TranslatableFields<CamelCase<DbDefaultTranslatableFields>>

const makeSlug = (words: string) => words.toLowerCase().replaceAll(' ', '-')

export const capitalize = (words: string) => words.charAt(0).toUpperCase() + words.slice(1)

export const range = (number: number) => Array.from(Array(number).keys())

export function getDates() {
  const toDate = new Date('2023-01-01T00:00:00')
  const fromDate = new Date(toDate)
  fromDate.setFullYear(fromDate.getFullYear() - 1)
  const createdAt = faker.date.between(fromDate, toDate)
  return {
    createdAt: createdAt.toJSON(),
    updatedAt: faker.date.between(createdAt, toDate).toJSON(),
  }
}

export function getTitles(locales: LanguageCode[]) {
  return locales.reduce<Titles>(
    (acc, locale) => {
      faker.setLocale(locale)
      const words = faker.lorem.words()
      const title = capitalize(words)
      const shortTitle = title.split(' ').slice(0, 2).join(' ')
      return {
        ...acc,
        title: { ...acc.title, [locale]: title },
        shortTitle: { ...acc.shortTitle, [locale]: shortTitle },
      }
    },
    { shortTitle: {}, title: {} }
  )
}

export function getTitlesSlug(locales: LanguageCode[]) {
  const titles = getTitles(locales)
  const title = titles.title?.[locales[0]] ?? ''
  return {
    ...titles,
    slug: makeSlug(title),
  }
}

export function getTitlesPath(locales: LanguageCode[], parentPath: string[]) {
  const titles = getTitles(locales)
  const title = titles.title?.[locales[0]] ?? ''
  return {
    ...titles,
    path: [...parentPath, makeSlug(title)].join('/'),
  }
}
