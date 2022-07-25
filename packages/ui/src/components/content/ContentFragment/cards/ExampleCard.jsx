import { EyeOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

import { attributeType, contentType } from '@innodoc/misc/propTypes'
import { getNumberedTitle } from '@innodoc/misc/utils'

import Card from './Card.jsx'

function ExampleCard({ attributes, content, id }) {
  const { t } = useTranslation()
  return (
    <Card
      title={getNumberedTitle(t('content.example'), attributes)}
      cardType="example"
      icon={<EyeOutlined />}
      content={content}
      id={id}
    />
  )
}

ExampleCard.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  id: PropTypes.string,
}

ExampleCard.defaultProps = {
  id: null,
}

export default ExampleCard
