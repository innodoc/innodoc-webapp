import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'
import { withNamespaces } from 'react-i18next'

import css from './style.sass'
import SectionLink from '../../../SectionLink'
import { sectionType } from '../../../../lib/propTypes'

const Subsection = subSection => (
  <List.Item>
    <SectionLink sectionId={subSection.id} />
  </List.Item>
)

Subsection.propTypes = sectionType.isRequired

const SubsectionList = ({ subsections, t }) => {
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
  t: PropTypes.func.isRequired,
}

export { Subsection, SubsectionList } // for testing
export default withNamespaces()(SubsectionList)
