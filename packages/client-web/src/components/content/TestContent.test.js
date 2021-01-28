import React from 'react'
import { shallow } from 'enzyme'
import { Result } from 'antd'
import { EditOutlined, FileDoneOutlined, ReloadOutlined, SendOutlined } from '@ant-design/icons'

import { resetTest, submitTest } from '@innodoc/client-store/src/actions/user'

import TestContent from './TestContent'

jest.mock('@innodoc/common/src/i18n')

const mockDispatch = jest.fn()
let mockTestInfo
jest.mock('react-redux', () => ({
  useDispatch: () => mockDispatch,
  useSelector: () => mockTestInfo,
}))

let mockIsMounted
jest.mock('../../hooks/useIsMounted', () => () => ({ current: mockIsMounted }))

describe('<TestContent />', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockTestInfo = {
      canBeSubmitted: true,
      canBeReset: true,
      isSubmitted: false,
      score: undefined,
      totalScore: 20,
    }
    mockIsMounted = true
  })

  it('should render', () => {
    const wrapper = shallow(
      <TestContent id="foo/bar">
        <p>Test content</p>
      </TestContent>
    )
    expect(wrapper.text()).toContain('Test content')
    expect(wrapper.text()).toContain('content.test.introduction.title')
    expect(wrapper.text()).toContain('content.test.introduction.item1')
    expect(wrapper.text()).toContain('content.test.introduction.item2')
    expect(wrapper.text()).toContain('content.test.introduction.item3')
    expect(wrapper.text()).toContain('content.test.introduction.item4')

    const result = wrapper.find(Result)
    const ExtraComp = () => result.prop('extra')
    const resultsExtraWrapper = shallow(<ExtraComp />)
    expect(resultsExtraWrapper).toHaveLength(2)
    const submitBtn = resultsExtraWrapper.at(0)
    const resetBtn = resultsExtraWrapper.at(1)
    expect(submitBtn.prop('disabled')).toBe(false)
    const SubmitBtnIconComp = () => submitBtn.prop('icon')
    expect(shallow(<SubmitBtnIconComp />).is(SendOutlined)).toBe(true)
    expect(submitBtn.text()).toBe('content.test.actions.submit')
    expect(resetBtn.prop('disabled')).toBe(false)
    const ResetBtnIconComp = () => resetBtn.prop('icon')
    expect(shallow(<ResetBtnIconComp />).is(ReloadOutlined)).toBe(true)
    expect(resetBtn.text()).toBe('content.test.actions.reset')
    const ResultIconComp = () => result.prop('icon')
    expect(shallow(<ResultIconComp />).is(EditOutlined)).toBe(true)
    expect(result.prop('subTitle')).toBe('content.test.resultText.notSubmitted')
    expect(result.prop('title')).toBe('content.test.resultTitle.notSubmitted')
  })

  it('should not test result on server', () => {
    mockIsMounted = false
    const wrapper = shallow(
      <TestContent id="foo/bar">
        <p>Test content</p>
      </TestContent>
    )
    expect(wrapper.exists(Result)).toBe(false)
  })

  it('should disable submit button if canBeSubmitted=false', () => {
    mockTestInfo.canBeSubmitted = false
    const wrapper = shallow(<TestContent id="foo/bar" />)
    const ExtraComp = () => wrapper.find(Result).prop('extra')
    expect(
      shallow(<ExtraComp />)
        .at(0)
        .prop('disabled')
    ).toBe(true)
  })

  it('should disable reset button if canBeReset=false', () => {
    mockTestInfo.canBeReset = false
    const wrapper = shallow(<TestContent id="foo/bar" />)
    const ExtraComp = () => wrapper.find(Result).prop('extra')
    expect(
      shallow(<ExtraComp />)
        .at(1)
        .prop('disabled')
    ).toBe(true)
  })

  it('should show results for submitted test', () => {
    mockTestInfo.isSubmitted = true
    mockTestInfo.score = 10
    const result = shallow(<TestContent id="foo/bar" />).find(Result)
    const ResultIconComp = () => result.prop('icon')
    expect(shallow(<ResultIconComp />).is(FileDoneOutlined)).toBe(true)
    expect(result.prop('subTitle')).toBe('content.test.resultText.submitted')
    const ResultTitleComp = () => result.prop('title')
    const resultTitleWrapper = shallow(<ResultTitleComp />)
    expect(resultTitleWrapper.prop('i18nKey')).toBe('content.test.resultTitle.submitted')
  })

  it('should dispatch submitTest', () => {
    const result = shallow(<TestContent id="foo/bar" />).find(Result)
    const SubmitBtnComp = () => result.prop('extra')[0]
    const submitBtn = shallow(<SubmitBtnComp />)
    submitBtn.simulate('click')
    expect(mockDispatch).toHaveBeenCalledWith(submitTest('foo/bar'))
  })

  it('should dispatch resetTest', () => {
    const result = shallow(<TestContent id="foo/bar" />).find(Result)
    const ResetBtnComp = () => result.prop('extra')[1]
    const resetBtn = shallow(<ResetBtnComp />)
    resetBtn.simulate('click')
    expect(mockDispatch).toHaveBeenCalledWith(resetTest('foo/bar'))
  })
})
