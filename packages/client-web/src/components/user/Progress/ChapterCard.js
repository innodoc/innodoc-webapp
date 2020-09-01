import React from 'react'
import PropTypes from 'prop-types'
import dynamic from 'next/dynamic'
import { Card, Grid, Row, Typography } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'

import { Trans, useTranslation } from '@innodoc/common/src/i18n'

import { SectionLink } from '../../content/links'
import css from './style.sss'

const DynamicChapterPieChart = dynamic(() => import('./ChapterPieChart'), {
  ssr: false,
})

const getStatus = (percent) => (percent === 100 ? 'success' : 'normal')
const getStatusTest = (percent, minScore) => {
  if (percent >= minScore) {
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
  const wideLayout = screens && Object.hasOwnProperty.call(screens, 'md') ? screens.md : true

  const chartData = ['moduleUnits', 'exercises', 'finalTest'].map((key) => {
    const keyData = progress[key]
    if (keyData) {
      const [value, total] = keyData
      const percent = Math.round((100 * value) / total)
      return {
        key,
        value,
        total,
        percent,
        status: key === 'finalTest' ? getStatusTest(percent, minScore) : getStatus(percent),
      }
    }
    return { key, value: undefined }
  })
  const completed = chartData[2].percent >= minScore

  const cardTitle = (
    <SectionLink contentId={sectionId}>
      <a>
        {t('progress.chapter')} {title}
      </a>
    </SectionLink>
  )

  const pieCharts = chartData.map(({ key, value, total, percent, status }) => {
    const disabled = typeof value === 'undefined'
    const tKey = `progress.pieCharts.${key}`
    const description = disabled ? undefined : (
      <Trans i18nKey={`${tKey}.description`}>
        Scored <strong>{{ value }}</strong> of <strong>{{ total }}</strong>.
      </Trans>
    )
    return (
      <DynamicChapterPieChart
        description={description}
        disabled={disabled}
        key={key}
        percent={percent}
        status={status}
        title={t(`${tKey}.${disabled ? 'titleDisabled' : 'title'}`)}
        wideLayout={wideLayout}
      />
    )
  })

  const completeText = t('progress.chapterComplete')
  const extra = completed ? (
    <>
      <Typography.Text className={css.complete} strong>
        {completeText}
      </Typography.Text>{' '}
      <CheckCircleTwoTone title={completeText} twoToneColor={css['color-complete']} />
    </>
  ) : null

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
    exercises: PropTypes.array,
    finalTest: PropTypes.array,
  }).isRequired,
  sectionId: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export { DynamicChapterPieChart } // for testing
export default ChapterCard
