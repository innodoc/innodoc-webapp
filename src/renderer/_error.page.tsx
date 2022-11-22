import { Typography } from '@mui/material'

import PageHeader from '#ui/components/common/PageHeader'

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
      <PageHeader>{captionText}</PageHeader>
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
