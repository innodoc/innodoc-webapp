import React, { useState } from 'react'
import { Button } from 'antd'
import { ArrowLeftOutlined, ArrowRightOutlined } from '@ant-design/icons'
import MathJax from '@innodoc/react-mathjax-node'

import { useTranslation } from '@innodoc/common/src/i18n'
import { contentType } from '@innodoc/client-misc/src/propTypes'

import ExerciseCard from './ExerciseCard'
import css from './style.sss'

const ExerciseRouletteCard = ({ content: exercises }) => {
  const { t } = useTranslation()
  const [exerciseNum, setExerciseNum] = useState(0)
  const exercise = exercises[exerciseNum]
  const [[id, , attributes], content] = exercise.c

  const counterText = t('content.exerciseRoulette.counter', {
    num: exerciseNum + 1,
    total: exercises.length,
  })
  const extra = [
    <span key="counter">{counterText}</span>,
    <Button
      className={css.extraItem}
      disabled={exerciseNum === 0}
      icon={<ArrowLeftOutlined />}
      key="prev"
      onClick={() => setExerciseNum((prev) => prev - 1)}
      title={t('content.exerciseRoulette.prev')}
    />,
    <Button
      className={css.extraItem}
      disabled={exerciseNum === exercises.length - 1}
      icon={<ArrowRightOutlined />}
      key="next"
      onClick={() => setExerciseNum((prev) => prev + 1)}
      title={t('content.exerciseRoulette.next')}
    />,
  ]

  // By wrapping in MathJax.Provider, we prevent the whole page from
  // re-typesetting on setExercise().
  return (
    <MathJax.Provider>
      <ExerciseCard attributes={attributes} content={content} extra={extra} id={id} />
    </MathJax.Provider>
  )
}

ExerciseRouletteCard.propTypes = {
  content: contentType.isRequired,
}

export default ExerciseRouletteCard
