import React from 'react'
import PropTypes from 'prop-types'
import { List, Typography } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { sectionType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sss'
import { SectionLink } from '../links'

const Subsection = (subSection) => (
  <List.Item>
    <SectionLink contentId={subSection.id} />
  </List.Item>
)

Subsection.propTypes = sectionType.isRequired

const SubsectionList = ({ subsections }) => {
  const { t } = useTranslation()
  const header = (
    <Typography.Title className={css.listheader} level={2}>
      {t('content.subsections')}
    </Typography.Title>
  )

  return (
    <List
      size="small"
      header={header}
      bordered
      className={css.list}
      dataSource={subsections}
      renderItem={Subsection}
    />
  )
}

SubsectionList.propTypes = {
  subsections: PropTypes.arrayOf(sectionType).isRequired,
}

export { Subsection }
export default SubsectionList
