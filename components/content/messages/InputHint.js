import React from 'react'
import PropTypes from 'prop-types'
import { Message } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../lib/propTypes'
import ContentFragment from '../../ContentFragment'

const InputHint = ({ content, t, ...otherProps }) => {
  const contentFragment = <ContentFragment content={content} />

  return (
    <Message
      className="input-hint"
      color="olive"
      icon="keyboard"
      header={t('content.inputHint')}
      content={contentFragment}
      {...otherProps}
    />
  )
}
InputHint.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default translate()(InputHint)
