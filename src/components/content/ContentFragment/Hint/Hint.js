import React from 'react'
import PropTypes from 'prop-types'
import Collapse from 'antd/lib/collapse'
import Icon from 'antd/lib/icon'

import { withTranslation } from '../../../../lib/i18n'
import css from './style.sass'
import { attributesToObject } from '../../../../lib/util'
import { attributeType, contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const Hint = ({ attributes, content, t }) => {
  const attrsObj = attributesToObject(attributes)
  const caption = attrsObj.caption || t('content.hint')
  const header = (
    <React.Fragment>
      <Icon type="bulb" className={css.icon} />
      {caption}
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

Hint.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export { Hint } // for testing
export default withTranslation()(Hint)
