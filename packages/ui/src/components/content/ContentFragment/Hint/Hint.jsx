import { BulbOutlined } from '@ant-design/icons'
import { Collapse } from 'antd'
import { useTranslation } from 'next-i18next'

import { attributeType, contentType } from '@innodoc/misc/propTypes'
import { attributesToObject } from '@innodoc/misc/utils'

import ContentFragment from '../ContentFragment.jsx'

import css from './Hint.module.sss'

function Hint({ attributes, content }) {
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
