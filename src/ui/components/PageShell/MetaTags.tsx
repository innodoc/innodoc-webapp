import { Helmet } from 'react-helmet-async'

import { EMOTION_STYLE_INSERTION_POINT_NAME } from '#constants'
import { selectRouteInfo } from '#store/slices/appSlice'
import { useSelector } from '#ui/hooks/store'
import useGenerateUrl from '#ui/hooks/useGenerateUrl'
import useSelectCurrentCourse from '#ui/hooks/useSelectCurrentCourse'

function MetaTags() {
  const generateUrl = useGenerateUrl()
  const { course } = useSelectCurrentCourse()
  const { locale: currentLocale } = useSelector(selectRouteInfo)

  const languageLinks = (course?.locales ?? []).map((locale) => (
    <link href={generateUrl({ locale })} hrefLang={locale} key={locale} rel="alternate" />
  ))

  return (
    <Helmet>
      <html lang={currentLocale} />
      <title>{course?.title ?? ''}</title>
      <meta charSet="UTF-8" />
      <meta name="description" content={course?.description ?? ''} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <link rel="canonical" href={import.meta.env.INNODOC_APP_ROOT} />
      <link rel="icon" href="" /> {/** TODO add course logo? */}
      {languageLinks}
      <meta name={EMOTION_STYLE_INSERTION_POINT_NAME} content="" />
    </Helmet>
  )
}

export default MetaTags
