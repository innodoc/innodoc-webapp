import React from 'react'
import PropTypes from 'prop-types'
import { Accordion, Message } from 'semantic-ui-react'
import { translate } from 'react-i18next'

import { contentType } from '../../../../lib/propTypes'
import ContentFragment from '..'

const SolutionHint = ({ content, t }) => {
  const contentFragment = <ContentFragment content={content} />
  const panels = [
    {
      key: 'solution',
      title: t('content.solution'),
      content: {
        content: (
          <Message
            className="exercise-hint"
            color="green"
            icon="lightbulb"
            content={contentFragment}
          />
        ),
      },
    },
  ]
  return <Accordion panels={panels} fluid />
}

SolutionHint.propTypes = {
  content: contentType.isRequired,
  t: PropTypes.func.isRequired,
}

export default translate()(SolutionHint)
