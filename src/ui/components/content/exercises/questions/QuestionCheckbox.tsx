import { Checkbox, styled } from '@mui/material'
import { type ChangeEvent, type ReactNode, useState } from 'react'

const StyledCheckbox = styled(Checkbox)({
  verticalAlign: 'baseline',
})

function QuestionCheckbox({ children, ...other }: QuestionTextProps) {
  const [value, setValue] = useState<boolean | undefined>()

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.checked)
  }

  return (
    <StyledCheckbox
      checked={value === true}
      indeterminate={value === undefined}
      onChange={handleChange}
    />
  )
}

interface QuestionTextProps {
  children: ReactNode
}

export default QuestionCheckbox
