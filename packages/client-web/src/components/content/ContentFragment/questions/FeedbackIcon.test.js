import React from 'react'
import { shallow } from 'enzyme'
import {
  CheckCircleTwoTone,
  CloseCircleTwoTone,
  EllipsisOutlined,
} from '@ant-design/icons'

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

  it('should render (correct=not set)', () => {
    const wrapper = shallow(<FeedbackIcon />)
    expect(wrapper.find(EllipsisOutlined).prop('title')).toBe(
      'questions.feedback.indeterminate'
    )
  })

  it.each([
    [true, CheckCircleTwoTone, 'correct'],
    [false, CloseCircleTwoTone, 'incorrect'],
  ])('should render (correct=true)', (correct, Icon, correctString) => {
    const wrapper = shallow(<FeedbackIcon correct={correct} />)
    const icon = wrapper.find(Icon)
    expect(icon.prop('twoToneColor')).toBe(css[`color-${correctString}`])
    expect(icon.prop('title')).toBe(`questions.feedback.${correctString}`)
  })
})
