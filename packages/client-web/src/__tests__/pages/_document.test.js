import React from 'react'
import { shallow } from 'enzyme'
import Document, { Html, Main, NextScript } from 'next/document'

import InnodocDocument from './_document'

jest.mock('next-i18next/dist/commonjs/utils', () => ({
  lngFromReq: () => 'pt',
}))

describe('<InnoDocDocument />', () => {
  it('should render', () => {
    const wrapper = shallow(<InnodocDocument language="ru" />)
    expect(wrapper.find(Html).prop('lang')).toBe('ru')
    expect(wrapper.find('body').exists()).toBe(true)
    expect(wrapper.find(Main).exists()).toBe(true)
    expect(wrapper.find(NextScript).exists()).toBe(true)
  })

  describe('getInitialProps', () => {
    const getInitialPropsOrig = Document.getInitialProps
    afterEach(() => {
      Document.getInitialProps = getInitialPropsOrig
    })

    it('should add language to props', async () => {
      expect.assertions(1)
      Document.getInitialProps = () => {}
      const { language } = await InnodocDocument.getInitialProps({ req: {} })
      expect(language).toBe('pt')
    })

    it('should add Document initial props', async () => {
      expect.assertions(1)
      Document.getInitialProps = jest.fn(() => ({ someOtherProp: 'foo' }))
      const initialProps = await InnodocDocument.getInitialProps({ req: {} })
      expect(initialProps.someOtherProp).toBe('foo')
    })
  })
})
