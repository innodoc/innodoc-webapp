import PropTypes from 'prop-types'
import { List, Typography } from 'antd'
import { useTranslation } from 'next-i18next'

import { propTypes } from '@innodoc/misc'

import css from './SubsectionList.module.sss'
import { SectionLink } from '../links'

const Subsection = (subSection) => (
  <List.Item>
    <SectionLink contentId={subSection.id} />
  </List.Item>
)

Subsection.propTypes = propTypes.sectionType.isRequired

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
  subsections: PropTypes.arrayOf(propTypes.sectionType).isRequired,
}

export { Subsection }
export default SubsectionList
