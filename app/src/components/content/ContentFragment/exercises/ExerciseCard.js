import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { CheckOutlined, FormOutlined, UndoOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'

import { propTypes, util } from '@innodoc/misc'
import { resetExercise } from '@innodoc/store/src/actions/exercise'
import exerciseSelectors from '@innodoc/store/src/selectors/exercise'
import progressSelectors from '@innodoc/store/src/selectors/progress'
import sectionSelectors from '@innodoc/store/src/selectors/section'

import useIsMounted from '../../../../hooks/useIsMounted'
import Action from '../cards/Action'
import Card from '../cards/Card'
import FeedbackIcon from './questions/FeedbackIcon'
import { ExerciseProvider } from './ExerciseContext'
import css from './ExerciseCard.module.sss'

const ExerciseCard = ({ attributes, content, extra, id: exId }) => {
  const { t } = useTranslation()
  const isMounted = useIsMounted()
  const dispatch = useDispatch()
  const [showResult, setShowResult] = useState(false)
  const { id: sectionId, type: sectionType } = useSelector(sectionSelectors.getCurrentSection)
  const { isSubmitted } = useSelector(progressSelectors.getTest)
  const globalExId = `${sectionId}#${exId}`
  const exercise = useSelector((state) => exerciseSelectors.getExercise(state, globalExId))

  // Result shown only if all questions are answered on first render.
  const initialIsAnswered = useRef(exercise.isAnswered)
  useEffect(() => {
    if (initialIsAnswered.current) {
      setShowResult(true)
    }
  }, [initialIsAnswered])

  // For test sections: Show result if test is submitted.
  useEffect(() => {
    if (isSubmitted !== undefined) {
      setShowResult(isSubmitted)
    }
  }, [isSubmitted])

  const actions =
    sectionType !== 'test' && // Tests evaluate all exercises at once
    isMounted.current // Don't render on server as this leads to hydration issues
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

  const exTitle = util.getNumberedTitle(t('content.exercise.title'), attributes)
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
  attributes: propTypes.attributeType.isRequired,
  content: propTypes.contentType.isRequired,
  extra: PropTypes.node,
  id: PropTypes.string,
}

export default ExerciseCard
