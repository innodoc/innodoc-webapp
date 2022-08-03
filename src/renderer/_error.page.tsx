import { Typography } from '@mui/material'

function ErrorPage({ errorMsg, is404 }: ErrorPageProps) {
  let captionText = '500 Internal Server Error'
  let subtitle = 'Something went wrong.'

  if (is404) {
    captionText = '404 Page Not Found'
    subtitle = 'This page could not be found.'
  }
  if (errorMsg !== undefined) {
    subtitle = errorMsg
  }

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {captionText}
      </Typography>
      <Typography variant="subtitle1" gutterBottom component="p">
        {subtitle}
      </Typography>
    </>
  )
}

type ErrorPageProps = {
  errorMsg?: string
  is404?: boolean
}

export { ErrorPage as Page }
