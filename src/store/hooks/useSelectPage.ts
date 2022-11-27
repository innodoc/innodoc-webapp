import { createSelector } from '@reduxjs/toolkit'
import type { LanguageCode } from 'iso-639-1'
import { useMemo } from 'react'

import { useGetCoursePagesQuery } from '#store/slices/entities/pages'
import { selectCourseName, selectLocale } from '#store/slices/uiSlice'
import { defaultTranslatableFields } from '#types/entities/base'
import type { ApiPage } from '#types/entities/page'
import { useSelector } from '#ui/hooks/store'
import { translateEntity } from '#utils/i18n'

/** Return page by name */
function useSelectPage(pageName: ApiPage['name']) {
  const locale = useSelector(selectLocale)
  const courseName = useSelector(selectCourseName)

  const selectPage = useMemo(
    () =>
      createSelector(
        [
          (_result: { data: ApiPage[] | undefined }) => _result.data,
          (_result, _pageName: ApiPage['name']) => _pageName,
          (result, _pageName, _locale: LanguageCode) => _locale,
        ],
        (pages, _pageName, _locale) => {
          if (pages === undefined) return undefined
          const page = pages.find((p) => p.name === _pageName)
          if (page === undefined) return undefined
          return translateEntity(page, defaultTranslatableFields, _locale)
        }
      ),
    []
  )

  const result = useGetCoursePagesQuery(
    { courseName: courseName ?? '' },
    {
      selectFromResult: (result) => ({ page: selectPage(result, pageName, locale) }),
      skip: courseName === null,
    }
  )

  return result
}

export default useSelectPage
