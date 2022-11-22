import {
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell as MuiTableCell,
  TableContainer,
  TableHead,
  TableRow as MuiTableRow,
} from '@mui/material'
import type { Alignment, TableCell } from 'pandoc-filter'

import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function toAlign(alignment: Alignment) {
  switch (alignment['t']) {
    case 'AlignLeft':
      return 'left'
    case 'AlignRight':
      return 'right'
    case 'AlignCenter':
      return 'center'
  }
  return undefined
}

function TableRow({ aligns, cells }: TableRowProps) {
  return (
    <MuiTableRow>
      {cells.map(([, alignment, , , content], i) => (
        <MuiTableCell align={toAlign(alignment) ?? aligns[i]} key={i.toString()}>
          <ContentTree content={content} />
        </MuiTableCell>
      ))}
    </MuiTableRow>
  )
}

type TableRowProps = {
  aligns: Array<ReturnType<typeof toAlign>>
  cells: TableCell[]
}

function Table({
  content: [, [, captionLong], colSpecs, [, headRows], [[, , , bodyRows]]],
}: ContentComponentProps<'Table'>) {
  const aligns = colSpecs.map(([alignment]) => toAlign(alignment))

  const caption = captionLong ? (
    <caption>
      <ContentTree content={captionLong} />
    </caption>
  ) : null

  return (
    <TableContainer component={Paper} sx={{ my: 2 }}>
      <MuiTable
        sx={{
          '& > caption': {
            fontSize: '1em',
            fontStyle: 'italic',
            textAlign: 'center',
          },
        }}
      >
        {caption}
        <TableHead>
          {headRows.map(([, cells], i) => (
            <TableRow aligns={aligns} cells={cells} key={i.toString()} />
          ))}
        </TableHead>
        <TableBody>
          {bodyRows.map(([, cells], i) => (
            <TableRow aligns={aligns} cells={cells} key={i.toString()} />
          ))}
        </TableBody>
      </MuiTable>
    </TableContainer>
  )
}

export default Table
