import { CheckOutlined, FormOutlined, UndoOutlined } from '@ant-design/icons'
import { useTranslation } from 'next-i18next'
import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { attributeType, contentType } from '@innodoc/misc/propTypes'
import { getNumberedTitle } from '@innodoc/misc/utils'
import { selectById } from '@innodoc/store/selectors/exercises'
import { selectTest } from '@innodoc/store/selectors/progress'
import { selectSection } from '@innodoc/store/selectors/sections'

import useIsMounted from '../../../../hooks/useIsMounted.js'
import Action from '../cards/Action.jsx'
import Card from '../cards/Card.jsx'

import css from './ExerciseCard.module.sss'
import ExerciseProvider from './ExerciseContext/ExerciseProvider.jsx'
import FeedbackIcon from './questions/FeedbackIcon.jsx'

function ExerciseCard({ attributes, content, extra, id: exId }) {
  const { t } = useTranslation()
  const isMounted = useIsMounted()
  const dispatch = useDispatch()
  const [showResult, setShowResult] = useState(false)
  const { id: sectionId, type: sectionType } = useSelector(selectSection)
  const { isSubmitted } = useSelector(selectTest)
  const globalExId = `${sectionId}#${exId}`
  const exercise = useSelector((state) => selectById(state, globalExId))

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
