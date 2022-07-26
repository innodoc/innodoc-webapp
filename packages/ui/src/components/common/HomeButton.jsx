import { HomeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import { selectCourse } from '@innodoc/store/selectors/content'

import ContentLink from '../content/links/ContentLink.jsx'

function HomeButton() {
  const { t } = useTranslation()
  const course = useSelector(selectCourse)
  const homeLink = course?.homeLink

  return (
    homeLink && (
      <ContentLink href={homeLink}>
        <Button icon={<HomeOutlined />} type="primary">
          {t('common.home')}
        </Button>
      </ContentLink>
    )
  )
}

export default HomeButton
