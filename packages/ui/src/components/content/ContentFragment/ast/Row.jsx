import { Col as AntdCol, Row as AntdRow } from 'antd'

import { attributeType, contentType } from '@innodoc/misc/propTypes'
import { attributesToObject } from '@innodoc/misc/utils'

import ContentFragment from '../ContentFragment.jsx'

import css from './ast.module.sss'

const colPropNames = ['span', 'offset', 'xs', 'sm', 'md', 'lg', 'xl']
const rowPropNames = ['align', 'gutter']

const getPropsFromAttrs = (propNames, attrs) => {
  const attrsObj = attributesToObject(attrs)
  return propNames.reduce((acc, name) => {
    if (Object.hasOwnProperty.call(attrsObj, name)) {
      const intVal = parseInt(attrsObj[name], 10)
      acc[name] = Number.isNaN(intVal) ? attrsObj[name] : intVal
    }
    return acc
  }, {})
}

function Row({ attributes, content }) {
  const rowProps = {
    gutter: 8,
    ...getPropsFromAttrs(rowPropNames, attributes),
  }
  return (
    // eslint-disable-next-line react/jsx-props-no-spreading
    <AntdRow className={css.row} {...rowProps}>
      {content.map((col, idx) => {
        if (col.t === 'Div') {
          const [[, classNames, colAttrs], colContent] = col.c
          if (classNames.includes('col')) {
            const colProps = getPropsFromAttrs(colPropNames, colAttrs)
            return (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <AntdCol key={idx.toString()} {...colProps}>
                <ContentFragment content={colContent} />
              </AntdCol>
            )
          }
        }
        return null
      })}
    </AntdRow>
  )
}

Row.propTypes = {
  attributes: attributeType.isRequired,
  content: contentType.isRequired,
}

export default Row
