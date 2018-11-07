import React from 'react'
import PropTypes from 'prop-types'
import AntTable from 'antd/lib/table'

import css from './style.sass'
import ContentFragment from '..'

const alignMap = {
  AlignLeft: 'left',
  AlignRight: 'right',
  AlignCenter: 'center',
}

const Table = ({ data }) => {
  const [, alignment, , headerData, rowData] = data
  const tableProps = {}
  let columnArr

  // show header?
  if (headerData.some(tr => tr.length > 0)) {
    columnArr = headerData
  } else {
    [columnArr] = rowData
    tableProps.showHeader = false
  }

  tableProps.columns = columnArr.map((content, i) => ({
    title: <ContentFragment content={content} />,
    render: c => <ContentFragment content={c} />,
    key: i,
    dataIndex: i,
    align: alignMap[alignment[i].t],
  }))

  tableProps.dataSource = rowData.map((row, i) => ({
    ...row,
    key: i,
  }))

  return (
    <AntTable
      className={css.table}
      pagination={false}
      {...tableProps}
    />
  )
}

Table.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default Table
