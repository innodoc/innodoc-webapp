import React from 'react'
import { shallow } from 'enzyme'
import { CheckCircleTwoTone, CloseCircleTwoTone, EllipsisOutlined } from '@ant-design/icons'

import RESULT_VALUE from '@innodoc/client-misc/src/resultDef'

import FeedbackIcon from './FeedbackIcon'
import css from './style.sss'

jest.mock('@innodoc/client-misc/src/i18n', () => ({
  useTranslation: () => ({
    t: jest.fn((key) => key),
  }),
}))

describe('<FeedbackIcon />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render (result=NEUTRAL)', () => {
    const wrapper = shallow(<FeedbackIcon result={RESULT_VALUE.NEUTRAL} />)
    expect(wrapper.find(EllipsisOutlined).prop('title')).toBe(
      'questions.feedbackIcon.indeterminate'
    )
  })

  it.each([
    [true, CheckCircleTwoTone, RESULT_VALUE.CORRECT],
    [false, CloseCircleTwoTone, RESULT_VALUE.INCORRECT],
  ])('should render (correct=%s)', (correct, Icon, result) => {
    const wrapper = shallow(<FeedbackIcon result={result} />)
    const icon = wrapper.find(Icon)
    const correctStr = correct ? 'correct' : 'incorrect'
    expect(icon.prop('twoToneColor')).toBe(css[`color-${correctStr}`])
    expect(icon.prop('title')).toBe(`questions.feedbackIcon.${correctStr}`)
  })
})
