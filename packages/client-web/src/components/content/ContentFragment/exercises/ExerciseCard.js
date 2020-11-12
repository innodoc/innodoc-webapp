import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { CheckOutlined, FormOutlined, UndoOutlined } from '@ant-design/icons'

import { useTranslation } from '@innodoc/common/src/i18n'
import { attributeType, contentType } from '@innodoc/client-misc/src/propTypes'
import { getNumberedTitle } from '@innodoc/client-misc/src/util'
import { resetExercise } from '@innodoc/client-store/src/actions/exercise'
import exerciseSelectors from '@innodoc/client-store/src/selectors/exercise'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import useIsMounted from '../../../../hooks/useIsMounted'
import Action from '../cards/Action'
import Card from '../cards/Card'
import FeedbackIcon from './questions/FeedbackIcon'
import { ExerciseProvider } from './ExerciseContext'
import css from './style.sss'

const ExerciseCard = ({ attributes, content, extra, id: exId }) => {
  const { t } = useTranslation()
  const isMounted = useIsMounted()
  const dispatch = useDispatch()
  const [showResult, setShowResult] = useState(false)
  const { id: sectionId, type: sectionType } = useSelector(sectionSelectors.getCurrentSection)
  const globalExId = `${sectionId}#${exId}`
  const exercise = useSelector((state) => exerciseSelectors.getExercise(state, globalExId))

  // Result shown only if all questions are answered on first render. Later it
  // needs to be triggered manually by user.
  const initialIsAnswered = useRef(exercise.isAnswered)
  useEffect(() => {
    if (initialIsAnswered.current) {
      setShowResult(true)
    }
  }, [initialIsAnswered])

  // Don't render actions on server as this leads to hyrdation issues
  const actions =
    sectionType !== 'test' && isMounted.current
      ? [
          <Action
            disabled={!exercise.isAnswered || showResult}
            icon={<CheckOutlined />}
            key="verify"
            onClick={() => setShowResult(true)}
            title={t('content.exercise.verify')}
          />,
          <Action
            disabled={!exercise.isTouched}
            icon={<UndoOutlined />}
            key="reset"
            onClick={() => {
              dispatch(resetExercise(globalExId))
              setShowResult(false)
            }}
            title={t('content.exercise.reset')}
          />,
        ]
      : []

  const exTitle = getNumberedTitle(t('content.exercise.title'), attributes)
  const title = showResult ? (
    <>
      {exTitle}
      <FeedbackIcon className={css.feedbackIcon} isCorrect={exercise.isCorrect} />
    </>
  ) : (
    exTitle
  )

  return (
    <ExerciseProvider exercise={exercise} setShowResult={setShowResult} showResult={showResult}>
      <Card
        actions={actions}
        cardType="exercise"
        content={content}
        extra={extra}
        icon={<FormOutlined />}
        id={exId}
        title={title}
      />
    </ExerciseProvider>
  )
}

ExerciseCard.defaultProps = {
  extra: null,
  id: null,
}

ExerciseCard.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
  extra: PropTypes.node,
  id: PropTypes.string,
}

export default ExerciseCard
