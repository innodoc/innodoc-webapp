import i18nSelectors from './i18n'

const splitSectionPath = path => path.split('/')

const getSections = (toc, path) => {
  const idTokens = splitSectionPath(path)
  const sections = [{
    idx: -1, // toc doesn't have a child index
    path: '',
    data: {
      children: toc,
    },
  }]
  for (let i = 0; i < idTokens.length; i += 1) {
    const { children } = sections[sections.length - 1].data
    const idx = children.findIndex(s => s.id === idTokens[i])
    if (idx === -1) {
      return undefined
    }

    const current = children[idx]
    const prefix = sections
      .slice(1) // Ignore root
      .map(s => s.data.id) // Get IDs
      .join('/') // Create prefix path

    sections.push({
      idx,
      path: i === 0
        ? current.id
        : `${prefix}/${current.id}`,
      data: current,
    })
  }

  return sections
}

const findLastSubSectionPath = (toc, path) => {
  let sections = getSections(toc, path)
  if (sections === undefined) {
    return path
  }
  sections = sections.map(s => s.data)

  let current = sections[sections.length - 1]
  while (current.children !== undefined) {
    current = current.children[current.children.length - 1]
    sections.push({ id: current.id })
  }

  return sections.slice(1).map(s => s.id).join('/')
}

const hasSubSections = section => (
  section.children !== undefined && section.children.length > 0
)

const getCurrentAndParentSection = sections => (
  {
    current: sections.pop(),
    parent: sections.pop(),
  }
)

// Selectors
const getCurrentSectionPath = state => state.content.currentSectionId
const getLanguageContent = (state, language) => state.content.data[language]
const getSectionContent = (state, lang, path) => (
  getLanguageContent(state, lang).sections[path]
)
const getToc = (state, language) => getLanguageContent(state, language).toc
const getSection = (state, language, path) => {
  const sections = getSections(getToc(state, language), path)
  return sections === undefined
    ? undefined
    : sections[sections.length - 1].data
}
const getSectionLevel = (state, path) => splitSectionPath(path).length
const getSectionTitle = (state, language, path) => {
  if (path === undefined) {
    return undefined
  }

  const section = getSection(state, language, path)
  if (section === undefined) {
    return undefined
  }

  return section.title
}
const getCurrentBreadcrumbSections = (state, language) => {
  const sections = getSections(
    getToc(state, language),
    getCurrentSectionPath(state))
    .map(s => s.data)
    .slice(1)

  const result = []
  sections.forEach((s, idx) => {
    result.push({
      id: result.length > 0
        ? `${result[idx - 1].id}/${s.id}`
        : s.id,
      title: s.title,
    })
  })

  return result
}
const getPrevSectionPath = (state, language, path) => {
  if (path === null || path === undefined) {
    return undefined
  }

  const toc = getToc(state, language)
  const { current, parent } = getCurrentAndParentSection(getSections(toc, path))

  // Return parent section if this is the first sub section
  if (current.idx === 0) {
    return parent.path === '' ? undefined : parent.path
  }

  // Otherwise find the last sub section of previous sibling
  return findLastSubSectionPath(
    toc,
    parent.path === ''
      ? parent.data.children[current.idx - 1].id
      : `${parent.path}/${parent.data.children[current.idx - 1].id}`)
}
const getNextSectionPath = (state, language, path, first = true) => {
  if (path === null || path === undefined) {
    return undefined
  }

  const { current, parent } = getCurrentAndParentSection(getSections(getToc(state, language), path))

  // If this section has sub sections and we're not in a recursive call then
  // return first sub section
  if (first === true && hasSubSections(current.data)) {
    return `${current.path}/${current.data.children[0].id}`
  }

  // If this section is the last sub section of its parent then get the next sibling of the parent
  if (current.idx === parent.data.children.length - 1) {
    return parent.path === ''
      ? undefined
      : getNextSectionPath(state, language, `${parent.path}`, false)
  }

  // If none of the above is true, then return next sibling
  return parent.path === ''
    ? parent.data.children[current.idx + 1].id
    : `${parent.path}/${parent.data.children[current.idx + 1].id}`
}
const getNavSections = (state) => {
  const lang = i18nSelectors.getLanguage(state)
  const path = getCurrentSectionPath(state)
  const prev = getPrevSectionPath(state, lang, path)
  const next = getNextSectionPath(state, lang, path)

  return {
    prev: {
      path: prev === undefined ? null : prev,
      title: getSectionTitle(state, lang, prev),
    },
    next: {
      path: next === undefined ? null : next,
      title: getSectionTitle(state, lang, next),
    },
  }
}

export default {
  getCurrentSectionPath,
  getSectionContent,
  getLanguageContent,
  getToc,
  getSection,
  getSectionLevel,
  getSectionTitle,
  getCurrentBreadcrumbSections,
  getPrevSectionPath,
  getNextSectionPath,
  getNavSections,
}
