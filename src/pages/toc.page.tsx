import { useTranslation } from 'react-i18next'

import PageHeader from '@/ui/components/common/PageHeader'
import Toc from '@/ui/components/Toc/Toc'

function TocPage() {
  const { t } = useTranslation()
  return (
    <>
      <PageHeader iconName="mdi:table-of-contents">{t('internalPages.toc.title')}</PageHeader>
      <Toc renderExpanded />
    </>
  )
}

export { TocPage as Page }
