import { Helmet } from 'react-helmet-async'

import useSelectCurrentCourse from '#store/hooks/useSelectCurrentCourse'
import { selectLocale, selectUrlWithoutLocale } from '#store/slices/uiSlice'
import { useSelector } from '#ui/hooks/store'
import { formatUrl } from '#utils/url'

function MetaTags() {
  const { course } = useSelectCurrentCourse()
  const currentLocale = useSelector(selectLocale)
  const urlWithoutLocale = useSelector(selectUrlWithoutLocale)

  return (
    <Helmet>
      <html lang={currentLocale} />
      <title>{course?.title ?? ''}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={course?.description ?? ''} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={import.meta.env.INNODOC_APP_ROOT} />
      <link rel="icon" href="" /> {/** TODO add course logo? */}
      {(course?.locales ?? []).map((locale) => (
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
