import React from 'react'
import { shallow } from 'enzyme'
import { Form, Input } from 'antd'

import PasswordField from './PasswordField'

describe('<PasswordField />', () => {
  it('should render', () => {
    const wrapper = shallow(<PasswordField />)
    const formItem = wrapper.find(Form.Item)
    expect(formItem.prop('validateFirst')).toBe(true)
    expect(formItem.prop('rules')).toHaveLength(1)
    expect(wrapper.find(Input.Password).prop('autoComplete')).toBe('off')
  })

  it.each([true, false])('should render disabled=%s', (val) =>
    expect(
      shallow(<PasswordField disabled={val} />)
        .find(Input.Password)
        .prop('disabled')
    ).toBe(val)
  )

  it.each([true, false])('should render hasLabel=%s', (val) => {
    const wrapper = shallow(<PasswordField hasLabel={val} />)
    expect(wrapper.find(Form.Item).prop('label')).toBe(
      val ? 'user.password' : undefined
    )
    expect(wrapper.find(Input.Password).prop('placeholder')).toBe(
      val ? undefined : 'user.password'
    )
  })

  it.each([true, false])('should render isConfirm=%s', (val) => {
    const wrapper = shallow(<PasswordField isConfirm={val} />)
    const formItem = wrapper.find(Form.Item)
    expect(formItem.prop('dependencies')).toEqual(
      val ? ['password'] : undefined
    )
    expect(formItem.prop('name')).toBe(val ? 'confirm-password' : 'password')
    expect(formItem.prop('rules')).toHaveLength(val ? 2 : 1)
  })

  it('should render with label', () => {
    const wrapper = shallow(<PasswordField label="foo" />)
    expect(wrapper.find(Form.Item).prop('label')).toEqual('foo')
  })

  it('should render with name', () => {
    const wrapper = shallow(<PasswordField name="foo" />)
    expect(wrapper.find(Form.Item).prop('name')).toEqual('foo')
  })

  it.each([true, false])('should render with validate=%s', (val) => {
    const wrapper = shallow(<PasswordField validate={val} />)
    expect(wrapper.find(Form.Item).prop('rules')).toHaveLength(val ? 2 : 1)
  })

  describe('rules', () => {
    it.each([true, false])('should check passwords matching=%s', (doMatch) => {
      const wrapper = shallow(<PasswordField isConfirm />)
      const formItem = wrapper.find(Form.Item)
      const rule = formItem.prop('rules')[1]
      const { validator } = rule({ getFieldValue: () => 's3cr3t' })
      if (doMatch) {
        return expect(validator(rule, 's3cr3t')).resolves.toBeUndefined()
      }
      return expect(validator(rule, 'other pwd')).rejects.toThrow(
        'user.passwordValidation.mismatch'
      )
    })

    it.each([
      ['123ABCabc!', undefined],
      ['1!aA', 'min'],
      ['ABCABCabc!', 'digits'],
    ])('should validate password %s', (pwd, errorKey) => {
      const wrapper = shallow(<PasswordField validate />)
      const formItem = wrapper.find(Form.Item)
      const rule = formItem.prop('rules')[1]
      const { validator } = rule
      if (errorKey) {
        return expect(validator(rule, pwd)).rejects.toThrow(
          `user.passwordValidation.${errorKey}`
        )
      }
      return expect(validator(rule, pwd)).resolves.toBeUndefined()
    })
  })
})
