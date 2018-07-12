import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'semantic-ui-react'

import ContentFragment from '../../ContentFragment'

const alignMap = {
  AlignLeft: 'left',
  AlignRight: 'right',
  AlignCenter: 'center',
}

const InnoTable = ({ data }) => {
  const [, alignment, , headerData, rowData] = data

  // thead
  let thead
  if (headerData.some(tr => tr.length > 0)) {
    const ths = headerData.map(
      (th, i) => (
        <Table.HeaderCell key={i.toString()} textAlign={alignMap[alignment[i].t]}>
          <ContentFragment content={th} />
        </Table.HeaderCell>
      )
    )
    thead = (
      <Table.Header>
        <Table.Row>
          {ths}
        </Table.Row>
      </Table.Header>
    )
  }

  // tbody
  const trs = rowData.map((tr, i) => {
    const tds = tr.map(
      (td, j) => (
        <Table.Cell key={j.toString()} textAlign={alignMap[alignment[j].t]}>
          <ContentFragment content={td} />
        </Table.Cell>
      )
    )
    return (
      <Table.Row key={i.toString()}>
        {tds}
      </Table.Row>
    )
  })
  const tbody = (
    <Table.Body>
      {trs}
    </Table.Body>
  )

  return (
    <Table>
      {thead}
      {tbody}
    </Table>
  )
}

InnoTable.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default InnoTable
