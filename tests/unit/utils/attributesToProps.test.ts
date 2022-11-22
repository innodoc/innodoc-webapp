import attributesToProps from '#utils/attributesToProps'

test('attributesToProps', () => {
  expect(attributesToProps(undefined)).toBeUndefined()
  expect(attributesToProps({})).toStrictEqual({})
  expect(
    attributesToProps({
      'font-size': '24px',
      'xmlns:xlink': 'foo',
      'stroke-opacity': 1,
      style:
        'background-color: black; color: rgb(122, 192, 100); font: inherit; vertical-align: baseline;',
    })
  ).toStrictEqual({
    fontSize: '24px',
    xmlnsXlink: 'foo',
    strokeOpacity: 1,
    style: {
      backgroundColor: 'black',
      color: 'rgb(122, 192, 100)',
      font: 'inherit',
      verticalAlign: 'baseline',
    },
  })
})
