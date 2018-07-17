import React from 'react'
import { Button, Divider } from 'semantic-ui-react'

import ContentFragment from '..'
import { contentType } from '../../../../lib/propTypes'

// TODO: make button verify Exercise

const VerifyInfoButton = ({ content }) => (
  <React.Fragment>
    <Divider />
    <Button icon="check" content={<ContentFragment content={content} />} />
  </React.Fragment>
)

VerifyInfoButton.propTypes = {
  content: contentType.isRequired,
}

export default VerifyInfoButton
