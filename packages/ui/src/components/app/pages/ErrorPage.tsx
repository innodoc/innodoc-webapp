import { Alert, AlertTitle } from '@mui/material'
import type { ReactNode } from 'react'

function ErrorPage({ errorMsg, is404 }: ErrorPageProps) {
  let captionText = 'Error'
  let subtitle: ReactNode = 'Something went wrong.'

  if (is404) {
    captionText = '404 Page Not Found'
    subtitle = 'This page could not be found.'
  }
  if (errorMsg !== undefined) {
    subtitle = errorMsg
  }

  return (
    <Alert variant="outlined" severity="error">
      <AlertTitle>{captionText}</AlertTitle>
      {subtitle}
    </Alert>
  )
}

interface ErrorPageProps {
  errorMsg?: ReactNode
  is404?: boolean
}

export default ErrorPage
