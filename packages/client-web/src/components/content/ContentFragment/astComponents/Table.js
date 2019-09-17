import React from 'react'
import PropTypes from 'prop-types'
import AntTable from 'antd/es/table'

import css from './style.sass'
import ContentFragment from '..'

const alignMap = {
  AlignLeft: 'left',
  AlignRight: 'right',
  AlignCenter: 'center',
}

const Table = ({ data }) => {
  const [, alignment, , headerData, rowData] = data
  let columnArr
  let showHeader

  // show header?
  if (headerData.some((tr) => tr.length > 0)) {
    columnArr = headerData
  } else {
    [columnArr] = rowData
    showHeader = false
  }

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
      showHeader={showHeader}
    />
  )
}

Table.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default Table
