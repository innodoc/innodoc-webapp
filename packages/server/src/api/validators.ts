import type { CustomValidator } from 'express-validator'

import { PATH_RE, SLUG_RE } from '@innodoc/constants'

const slugRegex = new RegExp(`^${SLUG_RE}$`)
const sectionPathRegex = new RegExp(`^${PATH_RE}$`)

export const isSlug: CustomValidator = (value: string) => {
  if (!slugRegex.test(value)) {
    throw new Error(`${value} not a slug`)
  }
  return true
}

export const isSectionPath: CustomValidator = (value: string) => {
  if (!sectionPathRegex.test(value)) {
    throw new Error(`${value} not a section path`)
  }
  return true
}
