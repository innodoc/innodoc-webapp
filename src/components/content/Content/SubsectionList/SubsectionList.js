import React from 'react'
import PropTypes from 'prop-types'
import List from 'antd/lib/list'
import { withNamespaces } from 'react-i18next'

import css from './style.sass'
import SectionLink from '../../../SectionLink'
import { sectionType } from '../../../../lib/propTypes'

const SubsectionList = ({ subsections, currentLanguage, t }) => {
  const renderSubsection = subsection => (
    <List.Item>
      <SectionLink sectionId={subsection.id}>
        <a style={{ display: 'block' }}>
          {subsection.title[currentLanguage]}
        </a>
      </SectionLink>
    </List.Item>
  )
  const header = <h2 className={css.listheader}>{t('content.subsections')}</h2>
  return (
    <List
      size="small"
      header={header}
      bordered
      className={css.list}
      dataSource={subsections}
      renderItem={renderSubsection}
    />
  )
}

SubsectionList.propTypes = {
  subsections: PropTypes.arrayOf(sectionType).isRequired,
  currentLanguage: PropTypes.string.isRequired,
  t: PropTypes.func.isRequired,
}

export { SubsectionList } // for testing
export default withNamespaces()(SubsectionList)
