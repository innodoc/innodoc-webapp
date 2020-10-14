import React from 'react'
import { useSelector } from 'react-redux'
import { Button } from 'antd'
import { HomeOutlined } from '@ant-design/icons'

import courseSelectors from '@innodoc/client-store/src/selectors/course'
import { useTranslation } from '@innodoc/common/src/i18n'

import { InternalLink } from './content/links'

const HomeButton = () => {
  const { t } = useTranslation()
  const course = useSelector(courseSelectors.getCurrentCourse)

  return course ? (
    <InternalLink href={course.homeLink}>
      <Button icon={<HomeOutlined />} type="primary">
        {t('common.home')}
      </Button>
    </InternalLink>
  ) : null
}

export default HomeButton
