import { useTranslation } from 'react-i18next'

import PageHeader from '@/ui/components/common/PageHeader'

function TocPage() {
  const { t } = useTranslation()

  return <PageHeader iconName="mdi:table-of-contents">{t('internalPages.toc.title')}</PageHeader>
}

export { TocPage as Page }
