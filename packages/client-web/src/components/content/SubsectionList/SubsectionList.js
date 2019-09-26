import React from 'react'
import PropTypes from 'prop-types'
import { List } from 'antd'

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
  const header = <h2 className={css.listheader}>{t('content.subsections')}</h2>
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
