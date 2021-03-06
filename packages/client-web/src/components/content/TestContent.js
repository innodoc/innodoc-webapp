import React from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Result } from 'antd'
import { EditOutlined, FileDoneOutlined, ReloadOutlined, SendOutlined } from '@ant-design/icons'

import { resetTest, submitTest } from '@innodoc/client-store/src/actions/user'
import progressSelectors from '@innodoc/client-store/src/selectors/progress'
import { Trans, useTranslation } from '@innodoc/common/src/i18n'

import useIsMounted from '../../hooks/useIsMounted'
import css from './style.sss'

const TestContent = ({ children, id }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const isMounted = useIsMounted()
  const { canBeSubmitted, canBeReset, isSubmitted, score, totalScore } = useSelector(
    progressSelectors.getTest
  )

  // Test results only available on client
  let result = null
  if (isMounted.current) {
    const actions = [
      <Button
        className={css.testActionBtn}
        disabled={!canBeSubmitted}
        icon={<SendOutlined />}
        key="submit"
        onClick={() => dispatch(submitTest(id))}
        type="primary"
      >
        {t('content.test.actions.submit')}
      </Button>,
      <Button
        className={css.testActionBtn}
        disabled={!canBeReset}
        danger
        icon={<ReloadOutlined />}
        key="reset"
        onClick={() => dispatch(resetTest(id))}
      >
        {t('content.test.actions.reset')}
      </Button>,
    ]

    const resultTitle = isSubmitted ? (
      <Trans i18nKey="content.test.resultTitle.submitted">
        A score of <strong>{{ score }}</strong> out of <strong>{{ total: totalScore }}</strong> was
        achieved in the test.
      </Trans>
    ) : (
      t('content.test.resultTitle.notSubmitted')
    )
    const resultSubtitle = t(
      `content.test.resultText.${isSubmitted ? 'submitted' : 'notSubmitted'}`
    )
    const resultIcon = isSubmitted ? <FileDoneOutlined /> : <EditOutlined />

    result = (
      <Result
        extra={actions}
        icon={resultIcon}
        status="info"
        subTitle={resultSubtitle}
        title={resultTitle}
      />
    )
  }

  return (
    <>
      <p>{t('content.test.introduction.title')}</p>
      <ul>
        <li>{t('content.test.introduction.item1')}</li>
        <li>{t('content.test.introduction.item2')}</li>
        <li>{t('content.test.introduction.item3')}</li>
        <li>{t('content.test.introduction.item4')}</li>
      </ul>
      {children}
      {result}
    </>
  )
}

TestContent.defaultProps = {
  children: null,
}

TestContent.propTypes = {
  children: PropTypes.node,
  id: PropTypes.string.isRequired,
}

export default TestContent
