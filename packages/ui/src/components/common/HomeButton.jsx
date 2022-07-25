import { HomeOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useTranslation } from 'next-i18next'
import { useSelector } from 'react-redux'

import { getCurrentCourse } from '@innodoc/store/selectors/course'

import ContentLink from '../content/links/ContentLink.jsx'

function HomeButton() {
  const { t } = useTranslation()
  const course = useSelector(getCurrentCourse)

  return course ? (
    <ContentLink href={course.homeLink}>
      <Button icon={<HomeOutlined />} type="primary">
        {t('common.home')}
      </Button>
    </ContentLink>
  ) : null
}

export default HomeButton
