import { Alert, AlertTitle } from '@mui/material'

// function ErrorPage({ errorMsg, is404: is404Prop }: ErrorPageProps) {
function ErrorPage() {
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

  return (
    <Alert variant="outlined" severity="error">
      <AlertTitle>TODO</AlertTitle>
      TODO
    </Alert>
  )
}

export default ErrorPage
