import React from 'react'
import { mount, shallow } from 'enzyme'
import { CheckOutlined, FormOutlined, UndoOutlined } from '@ant-design/icons'

import { resetExercise } from '@innodoc/client-store/src/actions/exercise'
import sectionSelectors from '@innodoc/client-store/src/selectors/section'

import ExerciseCard from './ExerciseCard'
import { ExerciseProvider } from './ExerciseContext'
import Card from '../cards/Card'
import FeedbackIcon from './questions/FeedbackIcon'

const mockDispatch = jest.fn()
const mockSectionSelectors = sectionSelectors
let mockSectionType
let mockExercise

jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: (sel) => {
    if (sel === mockSectionSelectors.getCurrentSection) {
      return { id: 'foo/bar', type: mockSectionType }
    }
    return mockExercise
  },
}))

jest.mock('@innodoc/common/src/i18n')

let mockIsMounted
jest.mock('../../../../hooks/useIsMounted', () => () => ({ current: mockIsMounted }))

jest.mock('../../ContentFragment', () => () => null)

jest.mock('./ExerciseContext', () => ({
  ExerciseProvider: ({ children }) => children,
}))

const attrs = [['data-number', '1.1.1']]
const content = [{ foo: 'foo' }]

describe('<ExerciseCard />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockIsMounted = true
    mockSectionType = 'regular'
    mockExercise = { isAnswered: false, isCorrect: false, isTouched: false }
  })

  it('should render', () => {
    const wrapper = shallow(
      <ExerciseCard attributes={attrs} content={content} extra={['foo']} id="EX1" />
    )
    expect(wrapper.find(ExerciseProvider)).toHaveLength(1)
    const card = wrapper.find(Card)
    expect(card.prop('cardType')).toBe('exercise')
    expect(card.prop('content')).toBe(content)
    expect(card.prop('extra')[0]).toBe('foo')
    expect(card.prop('icon')).toEqual(<FormOutlined />)
    expect(card.prop('id')).toBe('EX1')
    expect(card.prop('title')).toBe('content.exercise.title 1.1.1')
  })

  it('should show result if initially rendered with answered question', () => {
    mockExercise = { isAnswered: true, isCorrect: false, isTouched: false }
    const wrapper = mount(<ExerciseCard attributes={attrs} content={content} />)
    expect(wrapper.find(ExerciseProvider).prop('showResult')).toBe(true)
  })

  it.each([true, false])(
    'should show title and <FeedbackIcon /> in title with showResult=true (isCorrect=%s)',
    (isCorrect) => {
      mockExercise = { isAnswered: true, isCorrect, isTouched: true }
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} />)
      const VerifyAction = () => wrapper.find(Card).prop('actions')[0]
      const verifyAction = shallow(<VerifyAction />)
      verifyAction.simulate('click')
      const Title = () => wrapper.find(Card).prop('title')
      const title = shallow(<Title />)
      expect(title.text()).toContain('content.exercise.title 1.1.1')
      expect(title.find(FeedbackIcon).prop('isCorrect')).toBe(isCorrect)
    }
  )

  describe('actions', () => {
    it('should render actions', () => {
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} />)
      const actions = wrapper.find(Card).prop('actions')
      expect(actions).toHaveLength(2)

      const VerifyAction = () => actions[0]
      const verifyAction = shallow(<VerifyAction />)
      expect(verifyAction.prop('disabled')).toBe(true)
      expect(verifyAction.prop('title')).toBe('content.exercise.verify')
      const VerifyIcon = () => verifyAction.prop('icon')
      const verifyIcon = shallow(<VerifyIcon />)
      expect(verifyIcon.exists(CheckOutlined)).toBe(true)

      const ResetAction = () => actions[1]
      const resetAction = shallow(<ResetAction />)
      expect(resetAction.prop('disabled')).toBe(true)
      expect(resetAction.prop('title')).toBe('content.exercise.reset')
      const ResetIcon = () => resetAction.prop('icon')
      const resetIcon = shallow(<ResetIcon />)
      expect(resetIcon.exists(UndoOutlined)).toBe(true)
    })

    it('should enable verify with anwered exercise', () => {
      mockExercise = { isAnswered: true, isCorrect: false, isTouched: false }
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} />)
      const VerifyAction = () => wrapper.find(Card).prop('actions')[0]
      const verifyAction = shallow(<VerifyAction />)
      expect(verifyAction.prop('disabled')).toBe(false)
    })

    it('should disable verify with anwered exercise after verify clicked', () => {
      mockExercise = { isAnswered: true, isCorrect: false, isTouched: false }
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} />)
      const VerifyAction = () => wrapper.find(Card).prop('actions')[0]
      let verifyAction = shallow(<VerifyAction />)
      verifyAction.simulate('click')
      verifyAction = shallow(<VerifyAction />)
      expect(verifyAction.prop('disabled')).toBe(true)
    })

    it('should enable reset with touched exercised', () => {
      mockExercise = { isAnswered: false, isCorrect: false, isTouched: true }
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} />)
      const ResetAction = () => wrapper.find(Card).prop('actions')[1]
      const resetAction = shallow(<ResetAction />)
      expect(resetAction.prop('disabled')).toBe(false)
    })

    it('should set showResult=false and dispatch resetExercise after reset clicked', () => {
      mockExercise = { isAnswered: false, isCorrect: false, isTouched: true }
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} id="EX01" />)
      const ResetAction = () => wrapper.find(Card).prop('actions')[1]
      const resetAction = shallow(<ResetAction />)
      resetAction.simulate('click')
      expect(mockDispatch).toHaveBeenCalledWith(resetExercise('foo/bar#EX01'))
      expect(wrapper.find(ExerciseProvider).prop('showResult')).toBe(false)
    })

    it('should not render actions on server', () => {
      mockIsMounted = false
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} />)
      expect(wrapper.find(Card).prop('actions')).toHaveLength(0)
    })

    it('should not render actions with sectionType=test', () => {
      mockSectionType = 'test'
      const wrapper = shallow(<ExerciseCard attributes={attrs} content={content} />)
      expect(wrapper.find(Card).prop('actions')).toHaveLength(0)
    })
  })
})
