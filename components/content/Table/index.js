import React from 'react'
import PropTypes from 'prop-types'

import BaseContentComponent from '../Base'
import ContentFragment from '../../ContentFragment'
import css from './style.sass'

export default class Table extends BaseContentComponent {
  static propTypes = {
    data: PropTypes.array.isRequired
  }

  render() {
    const alignment = this.props.data[1].map(a => a.t)
    const headerData = this.props.data[3]
    const rowData = this.props.data[4]

    // thead
    let thead
    if (headerData.some((tr) => tr.length > 0)) {
      const ths = headerData.map((th, i) =>
        <th key={i.toString()} className={css[alignment[i]]}>
          <ContentFragment content={th} />
        </th>
      )
      thead = <thead><tr>{ths}</tr></thead>
    }

    // tbody
    const trs = rowData.map((tr, i) => {
      const tds = tr.map((td, j) =>
        <td key={j.toString()} className={css[alignment[j]]}>
          <ContentFragment content={td} />
        </td>
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
}
