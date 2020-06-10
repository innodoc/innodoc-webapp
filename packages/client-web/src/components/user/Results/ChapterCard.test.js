import React from 'react'
import { shallow } from 'enzyme'
import { Card, Typography } from 'antd'
import { CheckCircleTwoTone } from '@ant-design/icons'

import { SectionLink } from '../../content/links'
import ChapterCard from './ChapterCard'
import ChapterPieChart from './ChapterPieChart'

describe('<ChapterCard />', () => {
  it('should render', () => {
    const wrapper = shallow(
      <ChapterCard
        minScore={90}
        progress={{
          moduleUnits: [9, 18],
          exercises: [0, 20],
          finalTest: [0, 10],
        }}
        sectionId="foo"
        title="Foo"
      />
    )
    const card = wrapper.find(Card)
    expect(card).toHaveLength(1)
    const TitleComp = () => card.prop('title')
    const title = shallow(<TitleComp />)
    const titleLink = title.find(SectionLink)
    expect(titleLink.prop('contentId')).toBe('foo')
    expect(titleLink.find('a').text()).toBe('results.chapter Foo')
    expect(card.prop('extra')).toBeNull()
  })

  it('should render three pie charts', () => {
    const wrapper = shallow(
      <ChapterCard
        minScore={90}
        progress={{
          moduleUnits: [18, 18],
          exercises: [72, 80],
          finalTest: [12, 20],
        }}
        sectionId="foo"
        title="Foo"
      />
    )
    const charts = wrapper.find(ChapterPieChart)
    expect(charts).toHaveLength(3)

    const chartsExp = [
      [charts.at(0), 'moduleUnits', 100, 'success'],
      [charts.at(1), 'exercises', 90, 'normal'],
      [charts.at(2), 'finalTest', 60, 'exception'],
    ]
    chartsExp.forEach(([chart, key, percent, status]) => {
      const DescrComp = () => chart.prop('description')
      const descr = shallow(<DescrComp />)
      expect(descr.prop('i18nKey')).toBe(`results.pieCharts.${key}.description`)
      expect(chart.prop('percent')).toBe(percent)
      expect(chart.prop('status')).toBe(status)
      expect(chart.prop('title')).toBe(`results.pieCharts.${key}.title`)
    })
  })

  it('should render extra with completed test', () => {
    const wrapper = shallow(
      <ChapterCard
        minScore={90}
        progress={{
          moduleUnits: [9, 18],
          exercises: [0, 20],
          finalTest: [9, 10],
        }}
        sectionId="foo"
        title="Foo"
      />
    )
    const ExtraComp = () => wrapper.find(Card).prop('extra')
    const extra = shallow(<ExtraComp />)
    expect(extra.find(Typography.Text).at(0).prop('children')).toBe(
      'results.chapterComplete'
    )
    expect(extra.exists(CheckCircleTwoTone)).toBe(true)
  })
})
