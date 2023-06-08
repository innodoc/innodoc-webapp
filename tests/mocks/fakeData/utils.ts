import type { Faker } from '@faker-js/faker'
import type { LanguageCode } from 'iso-639-1'
import type { CamelCase } from 'type-fest'

import type { DbDefaultTranslatableFields, TranslatableFields } from '#types/entities/base'
import { capitalize } from '#utils/content'

import type { Fakers } from './types'

type Titles = TranslatableFields<CamelCase<DbDefaultTranslatableFields>>

const makeSlug = (words: string) => words.toLowerCase().replaceAll(' ', '-')

export const range = (number: number) => Array.from(Array(number).keys())

/** faker seed from string or number */
export function seed(seedVal: number | string, faker: Faker) {
  faker.seed(
    typeof seedVal === 'number'
      ? seedVal
      : seedVal
          .split('')
          .map((c) => c.charCodeAt(0))
          .reduce((acc, code) => acc + code, 0)
  )
}

export function getDates(fakers: Fakers) {
  const faker = Object.values(fakers)[0]
  const to = new Date('2023-01-01T00:00:00')
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - 1)
  const createdAt = faker.date.between({ from, to })
  return {
    createdAt: createdAt.toJSON(),
    updatedAt: faker.date.between({ from: createdAt, to }).toJSON(),
  }
}

export function getTitles(fakers: Fakers) {
  return Object.entries(fakers).reduce<Titles>(
    (acc, [locale, faker]) => {
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

export function getTitlesSlug(fakers: Fakers) {
  const titles = getTitles(fakers)
  const title = titles.title?.[getLocales(fakers)[0]] ?? ''
  return {
    ...titles,
    slug: makeSlug(title),
  }
}

export function getTitlesPath(fakers: Fakers, parentPath: string[]) {
  const titles = getTitles(fakers)
  const title = titles.title?.[getLocales(fakers)[0]] ?? ''
  return {
    ...titles,
    path: [...parentPath, makeSlug(title)].join('/'),
  }
}

export function getLocales(fakers: Fakers) {
  return Object.keys(fakers) as LanguageCode[]
}
