import React from 'react'

import { SectionLink } from '../content/links'
import ActiveSectionLabel from './ActiveSectionLabel'
import getTreeData from './getTreeData'

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
    expect(getTreeData(tocData, currentSectionId)).toEqual([
      {
        children: [
          {
            children: [
              {
                children: [],
                key: 'section-1/section-1-1/section-1-1-1',
                title: (
                  <SectionLink contentId="section-1/section-1-1/section-1-1-1" />
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
