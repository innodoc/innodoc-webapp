import React from 'react'
import Button from 'antd/lib/button'
import Divider from 'antd/lib/divider'

import ContentFragment from '..'
import { contentType } from '../../../../lib/propTypes'
import { unwrapPara } from '../../../../lib/util'

// TODO: make button verify Exercise

const VerifyInfoButton = ({ content }) => (
  <React.Fragment>
    <Divider />
    <Button icon="check">
      <ContentFragment content={unwrapPara(content)} />
    </Button>
  </React.Fragment>
)

VerifyInfoButton.propTypes = {
  content: contentType.isRequired,
}

export default VerifyInfoButton
