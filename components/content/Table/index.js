import React from 'react'
import PropTypes from 'prop-types'

import ContentFragment from '../../ContentFragment'
import css from './style.sass'

const Table = ({ data }) => {
  const [, alignment, , headerData, rowData] = data

  // thead
  let thead
  if (headerData.some(tr => tr.length > 0)) {
    const ths = headerData.map(
      (th, i) => (
        <th key={i.toString()} className={css[alignment[i].t]}>
          <ContentFragment content={th} />
        </th>
      )
    )
    thead = <thead><tr>{ths}</tr></thead>
  }

  // tbody
  const trs = rowData.map((tr, i) => {
    const tds = tr.map(
      (td, j) => (
        <td key={j.toString()} className={css[alignment[j].t]}>
          <ContentFragment content={td} />
        </td>
      )
    )
    return <tr key={i.toString()}>{tds}</tr>
  })
  const tbody = <tbody>{trs}</tbody>

  return (
    <table className={css.fullWidth}>
      {thead}
      {tbody}
    </table>
  )
}

Table.propTypes = { data: PropTypes.arrayOf(PropTypes.array).isRequired }

export default Table
