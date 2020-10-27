import React from 'react'
import { Collapse } from 'antd'
import { BulbOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'
import { attributesToObject } from '@innodoc/client-misc/src/util'
import { attributeType, contentType } from '@innodoc/client-misc/src/propTypes'

import css from './style.sss'
import ContentFragment from '..'

const Hint = ({ attributes, content }) => {
  const { t } = useTranslation()
  const attrsObj = attributesToObject(attributes)

  return (
    <Collapse className={css.hint}>
      <Collapse.Panel
        extra={<BulbOutlined className={css.icon} />}
        forceRender
        header={attrsObj.caption || t('content.hint')}
      >
        <ContentFragment content={content} />
      </Collapse.Panel>
    </Collapse>
  )
}

Hint.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
}

export default Hint
