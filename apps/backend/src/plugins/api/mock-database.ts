import type { LanguageCode } from 'iso-639-1'
import type {
  ConfigSchema,
  CourseSchema,
  FragmentTypeSchema,
  PageSchema,
  QuerySectionSchema,
  SectionSchema,
} from '@innodoc/shared-core/types'
import makeCourses from '@innodoc/shared-fixtures/courses'
import type { FakerCourse, FakerPage, FakerSection } from '@innodoc/shared-fixtures/types'

function getCourseBySlug(courses: FakerCourse[], slug: string): FakerCourse | undefined {
  return courses.find((c) => c.data.slug === slug)
}

/**
 * Mock database that serves fixture data instead of querying PostgreSQL.
 *
 * Implements the same interface as {@link Database} from `@innodoc/server-db`.
 */
class MockDatabase {
  private courses: FakerCourse[]

  constructor({ config: _config }: { config: ConfigSchema }) {
    void _config // Mock database doesn't need config; matches Database constructor signature
    this.courses = makeCourses()
  }

  async destroy() {
    // No resources to clean up
  }

  getCourse = (courseSlug: CourseSchema['slug']): Promise<CourseSchema | undefined> => {
    const course = getCourseBySlug(this.courses, courseSlug)
    if (!course) {
      return Promise.resolve(undefined)
    }
    const { id, slug, title, shortTitle, description, homeLink, locales, createdAt, updatedAt } = course.data
    return Promise.resolve({
      id: id + 1,
      slug,
      title,
      short_title: shortTitle ?? null,
      description: description ?? null,
      home_link: homeLink,
      locales,
      created_at: createdAt,
      updated_at: updatedAt,
    } satisfies CourseSchema)
  }

  getFragmentContent = (
    courseSlug: CourseSchema['slug'],
    locale: LanguageCode,
    fragmentType: FragmentTypeSchema,
  ): Promise<string | undefined> => {
    const course = getCourseBySlug(this.courses, courseSlug)
    const content = course?.fragments[fragmentType]?.[locale]
    return Promise.resolve(content ?? undefined)
  }

  getCoursePages = (courseSlug: CourseSchema['slug']): Promise<PageSchema[]> => {
    const course = getCourseBySlug(this.courses, courseSlug)
    if (!course) {
      return Promise.resolve([])
    }

    const pages: PageSchema[] = course.pages.map((page: FakerPage) => {
      const { id, slug, title, shortTitle, icon, linked, courseId, createdAt, updatedAt } = page.data
      return {
        id: id + 1,
        slug,
        title,
        short_title: shortTitle ?? null,
        icon: icon ?? null,
        linked: linked ?? null,
        course_id: courseId + 1,
        created_at: createdAt,
        updated_at: updatedAt,
      } satisfies PageSchema
    })
    return Promise.resolve(pages)
  }

  getPageContent = (
    courseSlug: CourseSchema['slug'],
    locale: LanguageCode,
    pageSlug: PageSchema['slug'],
  ): Promise<string | undefined> => {
    const course = getCourseBySlug(this.courses, courseSlug)
    const content = course?.pages.find((p: FakerPage) => p.data.slug === pageSlug)?.content[locale]
    return Promise.resolve(content ?? undefined)
  }

  getCourseSections = (courseSlug: CourseSchema['slug']): Promise<QuerySectionSchema[]> => {
    const course = getCourseBySlug(this.courses, courseSlug)
    if (!course) {
      return Promise.resolve([])
    }

    const sections: QuerySectionSchema[] = course.sections.map((section: FakerSection) => {
      const { id, path, title, shortTitle, type, order, courseId, parentId, createdAt, updatedAt } = section.data
      return {
        id: id + 1,
        path,
        title,
        short_title: shortTitle ?? null,
        type,
        order,
        course_id: courseId + 1,
        parent_id: parentId != null ? parentId + 1 : null,
        created_at: createdAt,
        updated_at: updatedAt,
      } satisfies QuerySectionSchema
    })
    return Promise.resolve(sections)
  }

  getSectionIdByPath = (
    courseSlug: CourseSchema['slug'],
    sectionPath: SectionSchema['path'],
  ): Promise<number | undefined> => {
    const course = getCourseBySlug(this.courses, courseSlug)
    const section = course?.sections.find((s: FakerSection) => s.data.path === sectionPath)
    return Promise.resolve(section ? section.data.id + 1 : undefined)
  }

  getSectionContent = (
    courseSlug: CourseSchema['slug'],
    locale: LanguageCode,
    sectionId: SectionSchema['id'],
  ): Promise<string | undefined> => {
    const course = getCourseBySlug(this.courses, courseSlug)
    const section = course?.sections.find((s: FakerSection) => s.data.id + 1 === sectionId)
    const content = section?.content[locale]
    return Promise.resolve(content ?? undefined)
  }
}

export default MockDatabase
