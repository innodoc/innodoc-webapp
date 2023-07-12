import { styled, TextField } from '@mui/material'
import { type ChangeEvent, type ReactNode, useState } from 'react'

// import type { NodeProps } from '#ui/components/content/types'

const StyledTextField = styled(TextField)({
  verticalAlign: 'baseline',
})

// const TAB_ITEM_PROPERTIES = ['length', 'points', 'precision'] as const

function TextQuestion(props: TextQuestionProps) {
  console.log(`TextQuestion`, props)
  const { children, id, ...other } = props
  const [value, setValue] = useState('')

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value)
  }

  return (
    <StyledTextField
      id={id}
      onChange={handleChange}
      size="small"
      value={value}
      variant="standard"
      {...other}
    ></StyledTextField>
  )
}

interface TextQuestionProps {
  children: ReactNode
  id?: string
  // nodeProps: NodeProps<typeof TAB_ITEM_PROPERTIES>
}

export default TextQuestion
