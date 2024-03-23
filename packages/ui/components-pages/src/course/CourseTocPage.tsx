import { useTranslation } from 'react-i18next'

import { PageHeader } from '@innodoc/components-common/misc'
import { StaticToc } from '@innodoc/components-common/toc'

function CourseTocPage() {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader iconName="mdi:table-of-contents">{t('pages.course.toc.title')}</PageHeader>
      <StaticToc />
    </>
  )
}

export default CourseTocPage
