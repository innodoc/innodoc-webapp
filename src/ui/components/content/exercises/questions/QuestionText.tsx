import { styled, TextField } from '@mui/material'
import { type ChangeEvent, type ReactNode, useState } from 'react'

const StyledTextField = styled(TextField)({
  verticalAlign: 'baseline',
})

function QuestionText({ children, id, ...other }: QuestionTextProps) {
  const [value, setValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <StyledTextField
      id={id}
      size="small"
      onChange={handleChange}
      value={value}
      {...other}
    ></StyledTextField>
  )
}

interface QuestionTextProps {
  children: ReactNode
  id?: string
}

export default QuestionText
