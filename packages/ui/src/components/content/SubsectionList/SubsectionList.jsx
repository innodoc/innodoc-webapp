import { List, Typography } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

import { sectionType } from '@innodoc/misc/propTypes'

import SectionLink from '../links/SectionLink.js'

import css from './SubsectionList.module.sss'

function Subsection({ id }) {
  return (
    <List.Item>
      <SectionLink contentId={id} />
    </List.Item>
  )
}

Subsection.propTypes = sectionType.isRequired

function SubsectionList({ subsections }) {
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
