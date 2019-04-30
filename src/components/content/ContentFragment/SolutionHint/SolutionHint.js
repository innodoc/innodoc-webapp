import React from 'react'
import PropTypes from 'prop-types'
import Collapse from 'antd/lib/collapse'
import Icon from 'antd/lib/icon'
import { withNamespaces } from 'react-i18next'

import css from './style.sass'
import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const SolutionHint = ({ content, t }) => {
  const header = (
    <React.Fragment>
      <Icon type="bulb" className={css.icon} />
      {t('content.solution')}
    </React.Fragment>
  )
  return (
    <Collapse bordered={false} className={css.collapse}>
      <Collapse.Panel header={header} forceRender>
        <div className={css.collapseContent}>
          <ContentFragment content={content} />
        </div>
      </Collapse.Panel>
    </Collapse>
  )
}

SolutionHint.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export { SolutionHint } // for testing
export default withNamespaces()(SolutionHint)
