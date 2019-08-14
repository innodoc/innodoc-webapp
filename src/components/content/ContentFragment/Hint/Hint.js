import React from 'react'
import Collapse from 'antd/lib/collapse'
import Icon from 'antd/lib/icon'

import { useTranslation } from '../../../../lib/i18n'
import css from './style.sass'
import { attributesToObject } from '../../../../lib/util'
import { attributeType, contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const Hint = ({ attributes, content }) => {
  const { t } = useTranslation()
  const attrsObj = attributesToObject(attributes)
  const caption = attrsObj.caption || t('content.hint')
  const header = (
    <>
      <Icon type="bulb" className={css.icon} />
      {caption}
    </>
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
}

export default Hint
