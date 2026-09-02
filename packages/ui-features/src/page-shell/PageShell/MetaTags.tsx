import { useHead } from '@unhead/react'
import { isLocale } from '@innodoc/shared-core/typeguards'
import type { FrontendRouteInfo } from '@innodoc/shared-core/types'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { useRoutes, useSelectCurrentCourse, useSelector } from '@innodoc/ui-shared/store-hooks'

// The app is served from the root of its origin (API paths resolve against it the same way), so
// an absolute page URL is the app root without a trailing slash plus the route path.
const appRoot = import.meta.env.INNODOC_PUBLIC_APP_ROOT.replace(/\/+$/u, '')

function MetaTags() {
  const { url } = useRoutes()
  const { course } = useSelectCurrentCourse()
  const { locale: currentLocale } = useSelector(selectRouteInfo)

  const absoluteUrl = (partialRouteInfo: Partial<FrontendRouteInfo>) => `${appRoot}${url(partialRouteInfo)}`

  const courseLocales = (course?.locales ?? []).filter((locale) => isLocale(locale))
  // x-default points at the course's first locale: the same destination the app redirects to when
  // the URL's locale is not offered by the course, so it never links to a page that 404s.
  const xDefaultLocale = courseLocales[0]

  const languageLinks = [
    ...(xDefaultLocale === undefined
      ? []
      : [{ href: absoluteUrl({ locale: xDefaultLocale }), hreflang: 'x-default', rel: 'alternate' as const }]),
    ...courseLocales.map((locale) => ({
      href: absoluteUrl({ locale }),
      hreflang: locale,
      rel: 'alternate' as const,
    })),
  ]

  useHead({
    htmlAttrs: { lang: currentLocale },
    link: [
      { href: absoluteUrl({}), rel: 'canonical' },
      { href: '', rel: 'icon' }, // TODO: Add course logo?
      ...languageLinks,
    ],
    meta: [
      // oxlint-disable-next-line unicorn/text-encoding-identifier-case -- HTML spec requires the charset attribute to be `utf-8`
      { charset: 'utf-8' },
      { content: course?.description ?? '', name: 'description' },
      { content: 'width=device-width, initial-scale=1.0', name: 'viewport' },
    ],
    title: course?.title ?? '',
  })

  return null
}

export default MetaTags
