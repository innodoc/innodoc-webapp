import { Login as LoginIcon } from '@mui/icons-material'
import { Box, Container, Typography } from '@mui/material'
import type { GetStaticPropsResult } from 'next'

import { contentApi, selectCourseTitle, useSelector, wrapper } from '@innodoc/store'

function Login() {
  const title = useSelector(selectCourseTitle)

  return (
    <Container>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          <LoginIcon sx={{ mr: 2 }} />
          Login {title.en}
        </Typography>
      </Box>
    </Container>
  )
}

export const getStaticProps = wrapper.getStaticProps((store) => async () => {
  void store.dispatch(contentApi.endpoints.getManifest.initiate())
  await Promise.all(contentApi.util.getRunningOperationPromises())

  return { props: {} } as GetStaticPropsResult<Record<string, never>>
})

export default Login
