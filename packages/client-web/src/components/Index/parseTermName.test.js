import React from 'react'
import { shallow } from 'enzyme'
import MathJax from '@innodoc/react-mathjax-node'

import parseTermName from './parseTermName'

const wrap = (termName) => {
  const Helper = ({ t }) => <>{parseTermName(t)}</>
  return shallow(<Helper t={termName} />).children()
}

const goodTerms = [
  ['$f(x)=x^2$', [[MathJax.Span, 'f(x)=x^2']]],
  ['Foo', [['span', 'Foo']]],
  [
    'Foo $x^2$',
    [
      ['span', 'Foo '],
      [MathJax.Span, 'x^2'],
    ],
  ],
  [
    '$x^2$ Foo',
    [
      [MathJax.Span, 'x^2'],
      ['span', ' Foo'],
    ],
  ],
  [
    'Foo $x^2$ Bar',
    [
      ['span', 'Foo '],
      [MathJax.Span, 'x^2'],
      ['span', ' Bar'],
    ],
  ],
  [
    '$x^2$$x$',
    [
      [MathJax.Span, 'x^2'],
      [MathJax.Span, 'x'],
    ],
  ],
  [
    '$x^2$ $x$',
    [
      [MathJax.Span, 'x^2'],
      ['span', ' '],
      [MathJax.Span, 'x'],
    ],
  ],
  ['10 \\$', [['span', '10 $']]],
  ['\\$ \\$', [['span', '$ $']]],
  [
    '$10$ \\$',
    [
      [MathJax.Span, '10'],
      ['span', ' $'],
    ],
  ],
  ['$$', [[MathJax.Span, '']]],
]

const badTerms = [
  '\\$ $',
  '$ \\$',
  '10 $',
  'Foo $$ bar $ baz',
  '10 \\$ 20\\$ 30$ 40 Euro',
]

describe('parseTermName', () => {
  describe('good', () => {
    test.each(goodTerms)('"%s"', (termName, result) => {
      const wrapper = wrap(termName)
      expect(wrapper).toHaveLength(result.length)
      wrapper.forEach((token, i) => {
        const [type, content] = result[i]
        expect(token.type()).toBe(type)
        expect(type === 'span' ? token.text() : token.prop('texCode')).toBe(
          content
        )
      })
    })
  })

  describe('bad', () => {
    test.each(badTerms)('"%s"', (termName) => {
      expect(() => {
        wrap(termName)
      }).toThrow()
    })
  })
})
