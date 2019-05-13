import React from 'react'
import { shallow } from 'enzyme'

import Document, { Main, NextScript } from 'next/document'

import InnodocDocument from './document'

describe('<InnoDocDocument />', () => {
  it('should render', () => {
    const wrapper = shallow(<InnodocDocument language="ru" />)
    const htmlTag = wrapper.find('html')
    expect(htmlTag.exists()).toBe(true)
    expect(htmlTag.prop('lang')).toBe('ru')
    expect(wrapper.find('body').exists()).toBe(true)
    expect(wrapper.find(Main).exists()).toBe(true)
    expect(wrapper.find(NextScript).exists()).toBe(true)
  })

  describe('getInitialProps', () => {
    it('should add language to props', async () => {
      expect.assertions(1)
      const getInitialPropsOrig = Document.getInitialProps
      Document.getInitialProps = jest.fn(() => {})
      const { language } = await InnodocDocument.getInitialProps({ req: { i18n: { language: 'pt' } } })
      expect(language).toBe('pt')
      Document.getInitialProps = getInitialPropsOrig
    })
  })
})
