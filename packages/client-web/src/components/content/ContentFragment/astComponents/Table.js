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
  const [, [, captionData], alignment, [, headerData], [[, , , rowData]]] = data
  const hasHeader = headerData.length > 0

  const columns = rowData[0][1].map((_, i) => ({
    render: (c) => <ContentFragment content={c[4]} />,
    title: hasHeader ? <ContentFragment content={headerData[0][1][i][4]} /> : null,
    key: i,
    dataIndex: i,
    align: alignMap[alignment[i][0].t],
  }))

  const dataSource = rowData.map((row, i) => ({
    ...row[1],
    key: i,
  }))

  const table = (
    <AntTable
      className={css.table}
      columns={columns}
      dataSource={dataSource}
      pagination={false}
      showHeader={hasHeader}
    />
  )

  const caption = captionData.length ? (
    <div className={css.tableCaption}>
      <ContentFragment content={captionData} />
    </div>
  ) : null

  return (
    <>
      {table}
      {caption}
    </>
  )
}

Table.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default Table
