import { Collapse } from 'antd'
import { BulbOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'

import { propTypes, util } from '@innodoc/misc'

import css from './Hint.module.sss'
import ContentFragment from '..'

const Hint = ({ attributes, content }) => {
  const { t } = useTranslation()
  const attrsObj = util.attributesToObject(attributes)

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
  attributes: propTypes.attributeType.isRequired,
  content: propTypes.contentType.isRequired,
}

export default Hint
