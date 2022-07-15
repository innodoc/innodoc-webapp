import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from 'next-i18next'

import { ContentLink } from '../content/links'

const HomeButton = () => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)

  return course ? (
    <ContentLink href={course.homeLink}>
      <Button icon={<HomeOutlined />} type="primary">
        {t('common.home')}
      </Button>
    </ContentLink>
  ) : null
}

export default HomeButton
