import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from 'antd'

const ChapterResults = ({ boxes, title }) => {
  if (!boxes.length) {
    return null
  }

  const exercisesBoxLinks = boxes.map((exerciseBox) => (
    <div key={exerciseBox.id.toString()}>
      <a>{exerciseBox.number}</a>
    </div>
  ))

  return (
    <>
      <Typography.Title level={2}>{title}</Typography.Title>
      {exercisesBoxLinks}
    </>
  )
}

ChapterResults.propTypes = {
  boxes: PropTypes.arrayOf(PropTypes.object).isRequired,
  title: PropTypes.string.isRequired,
}

export default ChapterResults
