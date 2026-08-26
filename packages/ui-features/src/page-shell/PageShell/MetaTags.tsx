import { useHead } from '@unhead/react'
import { isLocale } from '@innodoc/shared-core/typeguards'
import { selectRouteInfo } from '@innodoc/shared-store/slices/app'
import { useRoutes, useSelectCurrentCourse, useSelector } from '@innodoc/ui-shared/store-hooks'

function MetaTags() {
  const { url } = useRoutes()
  const { course } = useSelectCurrentCourse()
  const { locale: currentLocale } = useSelector(selectRouteInfo)

  const languageLinks = (course?.locales ?? [])
    .filter((l) => isLocale(l))
    .map((locale) => ({ href: url({ locale }), hreflang: locale, rel: 'alternate' as const }))

  useHead({
    htmlAttrs: { lang: currentLocale },
    link: [
      { href: import.meta.env.INNODOC_APP_ROOT, rel: 'canonical' },
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
