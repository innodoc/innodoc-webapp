import type { ApiSection } from '@innodoc/shared-core/schemas/types'

import makeContent from './make-content.js'
import { getDates, getTitlesPath, range, seed } from './utils.js'
import type { Fakers, FakerSection, SectionDef } from './types.js'

let seedVal = 0

const makeSection = (
  idx: number,
  parent: ApiSection | null,
  parentPath: string[],
  courseId: number,
  fakers: Fakers,
): FakerSection => {
  seed(`section-${courseId}-${seedVal}`, fakers)
  const section: ApiSection = {
    id: seedVal++,
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
  fakers: Fakers,
): FakerSection[] => {
  const section = makeSection(idx, parent, parentPath, courseId, fakers)
  if (childrenDef === null) {
    return [section]
  }

  const childrenDefArr = Array.isArray(childrenDef) ? childrenDef : range(childrenDef).map(() => null)

  const children: FakerSection[] = []
  for (const [idx, def] of childrenDefArr.entries()) {
    children.push(...mapSectionDef(def, idx, section.data, section.data.path.split('/'), courseId, fakers))
  }

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

const makeSections = (courseId: number, fakers: Fakers) => {
  const sections: FakerSection[] = []
  for (const [idx, def] of sectionDef.entries()) {
    sections.push(...mapSectionDef(def, idx, null, [], courseId, fakers))
  }
  return sections
}

export default makeSections
