import { faker } from '@faker-js/faker'
import type { Faker } from '@faker-js/faker'
import type { LanguageCode } from 'iso-639-1'

import { isArbitraryObject } from '@innodoc/shared-core/typeguards'

import type { Fakers, LocalizedContent } from './types'

const makeSlug = (words: string) => faker.helpers.slugify(words).toLocaleLowerCase()

const range = (number: number) => [...Array.from({ length: number }).keys()]

/** Capitalize string */
function capitalize(words: string) {
  return words.charAt(0).toUpperCase() + words.slice(1)
}

function isFaker(thing: unknown): thing is Faker {
  return isArbitraryObject(thing) && isArbitraryObject(thing.definitions)
}

function stringToNumber(str: string): number {
  let num = 0
  for (const codePointValue of [...str].map((c) => c.codePointAt(0))) {
    num += codePointValue ?? 0
  }
  return num
}

/** Seed faker from string or number */
function seed(seedVal: number | string, fakers: Faker | Fakers): void {
  const faker = isFaker(fakers) ? fakers : Object.values(fakers)[0]
  if (!faker) {
    throw new TypeError('Not a valid faker instance')
  }
  faker.seed(typeof seedVal === 'number' ? seedVal : stringToNumber(seedVal))
}

function getDates(fakers: Fakers) {
  const faker = Object.values(fakers)[0]
  if (!faker) {
    throw new Error('No faker object')
  }
  const to = new Date('2023-01-01T00:00:00')
  const from = new Date(to)
  from.setFullYear(from.getFullYear() - 1)
  const createdAt = faker.date.between({ from, to })
  return {
    createdAt: createdAt,
    updatedAt: faker.date.between({ from: createdAt, to }),
  }
}

function getTitles(fakers: Fakers) {
  const titles: { shortTitle: LocalizedContent; title: LocalizedContent } = { shortTitle: {}, title: {} }
  for (const [locale, faker] of Object.entries(fakers) as [LanguageCode, Faker][]) {
    const words = faker.lorem.words()
    const title = capitalize(words)
    titles.title[locale] = title
    titles.shortTitle[locale] = title.split(' ').slice(0, 2).join(' ')
  }
  return titles
}

function getTitlesSlug(fakers: Fakers) {
  const titles = getTitles(fakers)
  const title = titles.title[getFirstLocale(fakers)] ?? ''
  return {
    ...titles,
    slug: makeSlug(title),
  }
}

function getTitlesPath(fakers: Fakers, parentPath: string[]) {
  const titles = getTitles(fakers)
  const title = titles.title[getFirstLocale(fakers)] ?? ''
  return {
    ...titles,
    path: [...parentPath, makeSlug(title)].join('/'),
  }
}

function getFirstLocale(fakers: Fakers): LanguageCode {
  const locale = getLocales(fakers).at(0)
  if (!locale) {
    throw new Error('No locale')
  }
  return locale
}

function getLocales(fakers: Fakers): LanguageCode[] {
  return Object.keys(fakers) as LanguageCode[]
}

export { capitalize, getDates, getLocales, getTitlesPath, getTitlesSlug, range, seed }
