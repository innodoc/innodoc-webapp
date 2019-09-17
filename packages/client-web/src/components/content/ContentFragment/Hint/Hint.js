import React from 'react'
import Collapse from 'antd/es/collapse'
import Icon from 'antd/es/icon'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { attributesToObject } from '@innodoc/client-misc/src/util'
import { attributeType, contentType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sass'
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
