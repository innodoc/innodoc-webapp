import { useTranslation } from 'react-i18next'

import PageHeader from '@/ui/components/common/PageHeader'

function TocPage() {
  const { t } = useTranslation()

  return <PageHeader>{t('internalPages.toc')}</PageHeader>
}

export { TocPage as Page }
