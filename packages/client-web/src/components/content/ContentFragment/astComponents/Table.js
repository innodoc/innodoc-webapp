import React from 'react'
import PropTypes from 'prop-types'
import { Table as AntTable } from 'antd'

import css from './style.sss'
import ContentFragment from '..'

const alignMap = {
  AlignLeft: 'left',
  AlignRight: 'right',
  AlignCenter: 'center',
}

const Table = ({ data }) => {
  const [, alignment, , headerData, rowData] = data
  const hasHeader = headerData.some((tr) => tr.length > 0)
  const columnArr = hasHeader ? headerData : rowData[0]
  const columns = columnArr.map((content, i) => ({
    title: <ContentFragment content={content} />,
    render: (c) => <ContentFragment content={c} />,
    key: i,
    dataIndex: i,
    align: alignMap[alignment[i].t],
  }))

  const dataSource = rowData.map((row, i) => ({
    ...row,
    key: i,
  }))

  return (
    <AntTable
      className={css.table}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      showHeader={hasHeader}
    />
  )
}

Table.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default Table
