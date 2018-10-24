import React from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'
import { withNamespaces } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const InputHint = ({ content, t }) => {
  const contentFragment = <ContentFragment content={content} />

  return (
    <Message
      className="input-hint"
      color="olive"
      icon="keyboard"
      header={t('content.inputHint')}
      content={contentFragment}
    />
  )
}
InputHint.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default withNamespaces()(InputHint)
