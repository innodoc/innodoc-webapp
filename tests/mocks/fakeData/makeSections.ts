import type { ApiSection } from '#types/entities/section'

import makeContent from './makeContent'
import type { Fakers, Section, SectionDef } from './types'
import { getDates, getTitlesPath, range, seed } from './utils'

let id = 0

const makeSection = (
  idx: number,
  parent: ApiSection | null,
  parentPath: string[],
  courseId: number,
  fakers: Fakers
): Section => {
  seed(`section-${courseId}-${id}`, Object.values(fakers)[0])
  const section: ApiSection = {
    id: id++,
    courseId,
    parentId: parent?.id ?? null,
    type: 'regular',
    order: [...(parent?.order ?? []), idx],
    ...getTitlesPath(fakers, parentPath),
    ...getDates(fakers),
  }
  return { data: section, content: makeContent(fakers) }
}

const mapSectionDef = (
  childrenDef: SectionDef,
  idx: number,
  parent: ApiSection | null,
  parentPath: string[],
  courseId: number,
  fakers: Fakers
): Section[] => {
  const section = makeSection(idx, parent, parentPath, courseId, fakers)
  if (childrenDef === null) {
    return [section]
  }

  const childrenDefArr = Array.isArray(childrenDef)
    ? childrenDef
    : range(childrenDef).map(() => null)

  const children = childrenDefArr.reduce(
    (acc, def, idx) => [
      ...acc,
      ...mapSectionDef(def, idx, section.data, section.data.path.split('/'), courseId, fakers),
    ],
    [] as Section[]
  )

  return [section, ...children]
}

const sectionDef: SectionDef[] = [
  null, // no children
  4, // children w/o children
  [null, [2, [2, 3, 4]], [2, 1], [[4, 2, 3], [1, 2], 3], 3], // children that have children
  [3, 2, 4],
  [2, 3],
  2,
  null,
]

const makeSections = (courseId: number, fakers: Fakers) =>
  sectionDef.reduce(
    (acc, def, idx) => [...acc, ...mapSectionDef(def, idx, null, [], courseId, fakers)],
    [] as Section[]
  )

export default makeSections
