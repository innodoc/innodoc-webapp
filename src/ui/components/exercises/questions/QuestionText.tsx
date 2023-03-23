import { styled, TextField } from '@mui/material'
import { type ChangeEvent, type ReactNode, useState } from 'react'

const StyledTextField = styled(TextField)({
  verticalAlign: 'baseline',
})

function QuestionText({ children, ...other }: QuestionTextProps) {
  const [value, setValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return <StyledTextField size="small" onChange={handleChange} value={value}></StyledTextField>
}

interface QuestionTextProps {
  children: ReactNode
}

export default QuestionText
