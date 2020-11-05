import React, { useContext, useEffect } from 'react'
import { Button, Divider } from 'antd'
import { CheckOutlined } from '@ant-design/icons'

import { contentType } from '@innodoc/client-misc/src/propTypes'
import { unwrapPara } from '@innodoc/client-misc/src/util'

import { ExerciseContext } from '../ExerciseContext'
import ContentFragment from '../..'
import css from './style.sss'

const VerifyInfoButton = ({ content }) => {
  const { answered, setAutoVerify, setUserTriggeredVerify, userTriggeredVerify } = useContext(
    ExerciseContext
  )
  useEffect(() => setAutoVerify(false), [setAutoVerify])

  return (
    <div className={css.verifyBtn}>
      <Divider className={css.divider} />
      <Button
        disabled={!answered || userTriggeredVerify}
        icon={<CheckOutlined />}
        onClick={() => setUserTriggeredVerify(true)}
      >
        <span>
          <ContentFragment content={unwrapPara(content)} />
        </span>
      </Button>
    </div>
  )
}

VerifyInfoButton.propTypes = {
  content: contentType.isRequired,
}

export default VerifyInfoButton
