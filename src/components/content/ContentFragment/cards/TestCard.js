import React from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '../../../../lib/i18n'
import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const TestCard = ({ t, content, id }) => (
  <Card
    title={t('content.test')}
    cardType="test"
    icon="edit"
    content={content}
    id={id}
  />
)

TestCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
}

TestCard.defaultProps = {
  id: null,
}

export default withNamespaces()(TestCard)
