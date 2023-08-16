import { useTranslation } from 'react-i18next'

import { PageHeader } from '#components/common/misc'
import { StaticToc } from '#components/toc'

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
