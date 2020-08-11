import React from 'react'
import { AuditOutlined, FormOutlined } from '@ant-design/icons'

import { SectionLink } from '../content/links'
import ActiveSectionLabel from './ActiveSectionLabel'
import getTreeData from './getTreeData'
import css from './style.sss'

const tocData = [
  {
    id: 'section-1',
    title: { en: 'Section 1' },
    children: [
      {
        id: 'section-1/section-1-1',
        title: { en: 'Section 1-1' },
        children: [
          {
            id: 'section-1/section-1-1/section-1-1-1',
            title: { en: 'Section 1-1-1' },
          },
          {
            id: 'section-1/section-1-1/exercises-1-1-2',
            title: { en: 'Exercises 1-1-2' },
            type: 'exercises',
          },
          {
            id: 'section-1/section-1-1/test-1-1-3',
            title: { en: 'Test 1-1-3' },
            type: 'test',
          },
        ],
      },
    ],
  },
]

describe('getTreeData', () => {
  it.each([
    ['with', 'section-1/section-1-1'],
    ['w/o', null],
  ])('should return tree data %s current section', (_, currentSectionId) => {
    expect(getTreeData(tocData, currentSectionId, (s) => s)).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                key: 'section-1/section-1-1/section-1-1-1',
                title: <SectionLink contentId="section-1/section-1-1/section-1-1-1" />,
              },
              {
                children: [],
                key: 'section-1/section-1-1/exercises-1-1-2',
                title: (
                  <>
                    <SectionLink contentId="section-1/section-1-1/exercises-1-1-2" />
                    <FormOutlined
                      className={css.sectionIcon}
                      title="common.sectionTypes.exercises"
                    />
                  </>
                ),
              },
              {
                children: [],
                key: 'section-1/section-1-1/test-1-1-3',
                title: (
                  <>
                    <SectionLink contentId="section-1/section-1-1/test-1-1-3" />
                    <AuditOutlined className={css.sectionIcon} title="common.sectionTypes.test" />
                  </>
                ),
              },
            ],
            key: 'section-1/section-1-1',
            title: currentSectionId ? (
              <ActiveSectionLabel sectionId="section-1/section-1-1" />
            ) : (
              <SectionLink contentId="section-1/section-1-1" />
            ),
          },
        ],
        key: 'section-1',
        title: <SectionLink contentId="section-1" />,
      },
    ])
  })
})
