import React from 'react'
import { shallow } from 'enzyme'
import Icon, { CheckCircleTwoTone, CloseCircleTwoTone } from '@ant-design/icons'

import FeedbackIcon from './FeedbackIcon'
import css from './style.sss'

jest.mock('@innodoc/common/src/i18n')

describe('<FeedbackIcon />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render an empty icon w/o isCorrect', () => {
    const wrapper = shallow(<FeedbackIcon />)
    expect(wrapper.is(Icon)).toBe(true)
    const EmptyIcon = wrapper.prop('component')
    const emptyIconWrapper = shallow(<EmptyIcon />)
    const span = emptyIconWrapper.find('span')
    expect(span.hasClass(css.emptyIcon)).toBe(true)
  })

  it.each([
    [true, CheckCircleTwoTone],
    [false, CloseCircleTwoTone],
  ])('should render (isCorrect=%s)', (isCorrect, ExpIcon) => {
    const wrapper = shallow(<FeedbackIcon className="foo" isCorrect={isCorrect} />)
    const icon = wrapper.find(ExpIcon)
    const correctStr = isCorrect ? 'correct' : 'incorrect'
    expect(icon.prop('twoToneColor')).toBe(css[`color-${correctStr}`])
    expect(icon.prop('title')).toBe(`questions.feedbackIcon.${correctStr}`)
  })
})
