import React, { useContext } from 'react'
import Button from 'antd/es/button'
import Divider from 'antd/es/divider'

import { contentType } from '@innodoc/client-misc/src/propTypes'
import { unwrapPara } from '@innodoc/client-misc/src/util'
import ExerciseContext from '../cards/ExerciseCard/ExerciseContext'

import ContentFragment from '..'

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
