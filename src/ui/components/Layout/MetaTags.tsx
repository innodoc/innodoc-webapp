import { Helmet } from 'react-helmet-async'

import logoUrl from '@/assets/logo.svg'
import {
  selectCourseDescription,
  selectCourseTitle,
  selectLocales,
} from '@/store/selectors/content/course'
import { selectLocale, selectUrlWithoutLocale } from '@/store/selectors/ui'
import { useSelector } from '@/ui/hooks/store'
import { formatUrl } from '@/utils/url'

function MetaTags() {
  const title = useSelector(selectCourseTitle)
  const description = useSelector(selectCourseDescription)
  const locale = useSelector(selectLocale)
  const locales = useSelector(selectLocales)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)

  return (
    <Helmet>
      <html lang={locale} />
      <title>{title}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={import.meta.env.INNODOC_APP_ROOT} />
      <link rel="icon" href={logoUrl} />
      {locales.map((locale) => (
        <link
          href={formatUrl(
            urlWithoutLocale || '',
            locale,
            undefined,
            import.meta.env.INNODOC_APP_ROOT
          )}
          hrefLang={locale}
          key={locale}
          rel="alternate"
        />
      ))}
      <meta name="emotion-insertion-point" content="" />
    </Helmet>
  )
}

export default MetaTags
