import { useTranslation } from 'react-i18next'

import PageHeader from '#ui/components/common/PageHeader'
import StaticToc from '#ui/components/toc/StaticToc'

function TocPage() {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader iconName="mdi:table-of-contents">{t('builtinPages.toc.title')}</PageHeader>
      <StaticToc />
    </>
  )
}

export default TocPage
