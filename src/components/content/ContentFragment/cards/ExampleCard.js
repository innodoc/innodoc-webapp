import React from 'react'
import PropTypes from 'prop-types'

import { withNamespaces } from '../../../../lib/i18n'
import { contentType } from '../../../../lib/propTypes'
import Card from './Card'

const ExampleCard = ({ t, content, id }) => (
  <Card
    title={t('content.example')}
    cardType="example"
    icon="eye"
    content={content}
    id={id}
  />
)

ExampleCard.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
  id: PropTypes.string,
}

ExampleCard.defaultProps = {
  id: null,
}

export default withNamespaces()(ExampleCard)
