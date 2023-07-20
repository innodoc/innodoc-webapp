import { Checkbox, styled } from '@mui/material'
import { type ChangeEvent, type ReactNode, useState } from 'react'

const StyledCheckbox = styled(Checkbox)({
  verticalAlign: 'baseline',
})

function QuestionCheckbox({ children, id, ...other }: QuestionTextProps) {
  const [value, setValue] = useState<boolean | undefined>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.checked)
  }

  return (
    <StyledCheckbox
      checked={value === true}
      id={id}
      indeterminate={value === undefined}
      onChange={handleChange}
      {...other}
    />
  )
}

interface QuestionTextProps {
  children: ReactNode
  id?: string
}

export default QuestionCheckbox
