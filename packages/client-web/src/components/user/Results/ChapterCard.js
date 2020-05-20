import React from 'react'
import PropTypes from 'prop-types'
import { Card, Grid, Row, Typography } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'

import { Trans, useTranslation } from '@innodoc/client-misc/src/i18n'

import { SectionLink } from '../../content/links'
import ChapterPieChart from './ChapterPieChart'
import css from './style.sss'

const getStatus = (percent) => (percent === 100 ? 'success' : 'normal')
const getStatusTest = (percent) => {
  if (percent >= 90) {
    return 'success'
  }
  if (percent > 0) {
    return 'exception'
  }
  return 'normal'
}

const ChapterCard = ({ minScore, progress, sectionId, title }) => {
  const { t } = useTranslation()
  const screens = Grid.useBreakpoint()
  const wideLayout =
    screens && Object.hasOwnProperty.call(screens, 'md') ? screens.md : true

  const chartData = ['moduleUnits', 'exercises', 'finalTest'].map((key) => {
    const [value, total] = progress[key]
    const percent = Math.ceil((100 * value) / total)
    return {
      key,
      value,
      total,
      percent,
      status: key === 'finalTest' ? getStatusTest(percent) : getStatus(percent),
    }
  })
  const completed = chartData[2].percent >= minScore

  const cardTitle = (
    <SectionLink contentId={sectionId}>
      <a>
        {t('results.chapter')} {title}
      </a>
    </SectionLink>
  )

  const completeText = t('results.chapterComplete')
  const extra = completed ? (
    <>
      <Typography.Text className={css.complete} strong>
        {completeText}
      </Typography.Text>{' '}
      <CheckCircleTwoTone
        title={completeText}
        twoToneColor={css['color-complete']}
      />
    </>
  ) : null

  const pieCharts = chartData.map(({ key, value, total, percent, status }) => {
    const tKey = `results.pieCharts.${key}`
    const description = (
      <Trans i18nKey={`${tKey}.description`}>
        Scored <strong>{{ value }}</strong> of <strong>{{ total }}</strong>.
      </Trans>
    )
    return (
      <ChapterPieChart
        description={description}
        key={key}
        percent={percent}
        status={status}
        title={t(`${tKey}.title`)}
        wideLayout={wideLayout}
      />
    )
  })

  return (
    <Card className={css.resultCard} extra={extra} title={cardTitle}>
      <Row justify="space-between">{pieCharts}</Row>
    </Card>
  )
}

ChapterCard.propTypes = {
  minScore: PropTypes.number.isRequired,
  progress: PropTypes.shape({
    moduleUnits: PropTypes.array.isRequired,
    exercises: PropTypes.array.isRequired,
    finalTest: PropTypes.array.isRequired,
  }).isRequired,
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default ChapterCard
