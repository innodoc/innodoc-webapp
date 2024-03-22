import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { JsonBodyType } from 'msw'

import type { ApiCourse, ApiPage, ApiSection } from '@innodoc/schema/types'

const testCourse = {
  id: 0,
  createdAt: new Date(2024, 1, 17, 16, 23, 55),
  updatedAt: new Date(2024, 1, 17, 16, 23, 55),
  description: { en: 'This is a course for tests.' },
  homeLink: 'app:course|index',
  locales: ['en'],
  shortTitle: { en: 'Test' },
  slug: 'test-course',
  title: { en: 'Test Course' },
} satisfies ApiCourse

const pages = [
  {
    id: 0,
    courseId: 0,
    createdAt: new Date(2024, 1, 17, 16, 23, 55),
    updatedAt: new Date(2024, 1, 17, 16, 23, 55),
    icon: '',
    linked: ['footer', 'nav'],
    shortTitle: { en: 'About' },
    slug: 'about',
    title: { en: 'About the course' },
  },
] satisfies ApiPage[]

const sections = [
  {
    id: 0,
    courseId: 0,
    createdAt: new Date(2024, 1, 17, 16, 23, 55),
    updatedAt: new Date(2024, 1, 17, 16, 23, 55),
    order: [0],
    parentId: null,
    path: '/section-1',
    shortTitle: { en: 'Section 1' },
    title: { en: 'Course section 1' },
    type: 'regular',
  },
  {
    id: 1,
    courseId: 0,
    createdAt: new Date(2024, 1, 17, 16, 23, 55),
    updatedAt: new Date(2024, 1, 17, 16, 23, 55),
    order: [1],
    parentId: null,
    path: '/section-2',
    shortTitle: { en: 'Section 2' },
    title: { en: 'Course section 2' },
    type: 'regular',
  },
  {
    id: 2,
    courseId: 0,
    createdAt: new Date(2024, 1, 17, 16, 23, 55),
    updatedAt: new Date(2024, 1, 17, 16, 23, 55),
    order: [0, 0],
    parentId: 0,
    path: '/section-1/section-a',
    shortTitle: { en: 'Section A' },
    title: { en: 'Course section A' },
    type: 'regular',
  },
] satisfies ApiSection[]

const handlers: [string, JsonBodyType][] = [
  ['/api/course/test-course', testCourse],
  ['/api/course/test-course/pages', pages],
  ['/api/course/test-course/sections', sections],
]

const server = setupServer(
  ...handlers.map(([path, resp]) => http.get(`http://app.example.com${path}`, () => HttpResponse.json(resp))),
)

export default server
