import { InfoCircleOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

import { attributeType, contentType } from '@innodoc/misc/propTypes'
import { getNumberedTitle } from '@innodoc/misc/utils'

import Card from './Card.jsx'

function InfoCard({ attributes, content, id }) {
  const { t } = useTranslation()
  return (
    <Card
      title={getNumberedTitle(t('content.info'), attributes)}
      cardType="info"
      icon={<InfoCircleOutlined />}
      content={content}
      id={id}
    />
  )
}

InfoCard.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  id: PropTypes.string,
}

InfoCard.defaultProps = {
  id: null,
}

export default InfoCard
