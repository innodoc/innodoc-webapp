import Icon from '@ant-design/icons'
import KeyboardSvg from '@fortawesome/fontawesome-free/svgs/regular/keyboard.svg'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'

import { contentType } from '@innodoc/misc/propTypes'

import Card from './Card.jsx'

function InputHintCard({ content, id }) {
  const { t } = useTranslation()
  return (
    <Card
      title={t('content.inputHint')}
      cardType="inputHint"
      icon={<Icon component={KeyboardSvg} />}
      content={content}
      id={id}
    />
  )
}

InputHintCard.propTypes = {
  content: contentType.isRequired,
  id: PropTypes.string,
}

InputHintCard.defaultProps = {
  id: null,
}

export default InputHintCard
