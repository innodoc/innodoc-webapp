import React, { useContext } from 'react'
import Button from 'antd/lib/button'
import Divider from 'antd/lib/divider'

import ContentFragment from '..'
import { contentType } from '../../../../lib/propTypes'
import { unwrapPara } from '../../../../lib/util'
import ExerciseContext from '../cards/ExerciseCard/ExerciseContext'

const VerifyInfoButton = ({ content }) => {
  const {
    allAnswered,
    setAutoVerify,
    setUserTriggeredVerify,
    userTriggeredVerify,
  } = useContext(ExerciseContext)
  setAutoVerify(false)
  return (
    <>
      <Divider />
      <Button
        disabled={!allAnswered() || userTriggeredVerify}
        icon="check"
        onClick={() => setUserTriggeredVerify(true)}
      >
        <span>
          <ContentFragment content={unwrapPara(content)} />
        </span>
      </Button>
    </>
  )
}

VerifyInfoButton.propTypes = {
  content: contentType.isRequired,
}

export default VerifyInfoButton
