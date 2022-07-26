import { AuditOutlined, FormOutlined } from '@ant-design/icons'
import { Tag } from 'antd'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

function SectionTypeTag({ className, type }) {
  const { t } = useTranslation()

  if (!type) {
    return null
  }

  const color = type === 'exercises' ? 'green' : 'blue'
  const icon = type === 'exercises' ? <FormOutlined /> : <AuditOutlined />
  return (
    <Tag className={className} color={color} icon={icon}>
      {t(`common.sectionTypes.${type}`)}
    </Tag>
  )
}

SectionTypeTag.defaultProps = {
  className: null,
  type: null,
}

SectionTypeTag.propTypes = {
  className: PropTypes.string,
  type: PropTypes.oneOf(['exercises', 'test']),
}

export default SectionTypeTag