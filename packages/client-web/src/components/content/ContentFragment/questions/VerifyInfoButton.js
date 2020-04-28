import React, { useContext, useEffect } from 'react'
import { Button, Divider } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

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
  useEffect(() => setAutoVerify(false), [setAutoVerify])

  return (
    <>
      <Divider />
      <Button
        disabled={!allAnswered() || userTriggeredVerify}
        icon={<CheckOutlined />}
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
