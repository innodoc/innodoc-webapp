import React from 'react'
import { Result, Typography } from 'antd'

import { useTranslation } from '@innodoc/client-misc/src/i18n'
import { messageType } from '@innodoc/client-misc/src/propTypes'

const { Paragraph } = Typography

const LoadManifestFailure = ({ message: { level, type, text } }) => {
  const { t } = useTranslation()
  const subTitle = (
    <>
      {t(`userMessage.types.${type}.text`)}
      <Paragraph code>{text}</Paragraph>
    </>
  )
  return (
    <Result
      status={level}
      title={t(`userMessage.types.${type}.title`)}
      subTitle={subTitle}
    />
  )
}

LoadManifestFailure.propTypes = {
  message: messageType.isRequired,
}

export default LoadManifestFailure
