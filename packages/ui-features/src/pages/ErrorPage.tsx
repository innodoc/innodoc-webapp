import type { ReactElement } from 'react'
import { Alert, AlertTitle } from '@mui/material'

interface ErrorPageProps {
  errorMessage?: ReactElement
  is404?: boolean
}

function ErrorPage({ errorMessage, is404 }: ErrorPageProps) {
  // const pageContext = usePageContext()
  // const { abortReason } = pageContext
  // const abortStatusCode = pageContext.abortStatusCode as unknown
  // const is404 = is404Prop ?? pageContext.is404

  // let captionText = 'Error'
  // let subtitle: ReactNode = 'Something went wrong.'

  // if (is404) {
  //   captionText = '404 Page Not Found'
  //   subtitle = 'This page could not be found.'
  // } else if (typeof abortStatusCode === 'number') {
  //   captionText = `Error: ${String(abortStatusCode)}`
  // }

  // if (typeof abortReason === 'string') {
  //   subtitle = abortReason
  // } else if (errorMsg) {
  //   subtitle = errorMsg
  // }

  // return (
  //   <Alert variant="outlined" severity="error">
  //     <AlertTitle>{captionText}</AlertTitle>
  //     {subtitle}
  //   </Alert>
  // )

  let captionText = 'Error'
  if (is404) {
    captionText = '404 Page Not Found'
  }

  return (
    <Alert variant="outlined" severity="error">
      <AlertTitle>{captionText}</AlertTitle>
      {errorMessage}
    </Alert>
  )
}

export default ErrorPage
