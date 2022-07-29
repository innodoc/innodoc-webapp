import { Login as LoginIcon } from '@mui/icons-material'
import { Box, Container, Typography } from '@mui/material'
import type { GetStaticPropsResult } from 'next'
import type { SSRConfig } from 'next-i18next'

import { wrapper } from '@innodoc/store'

import getInnodocStaticProps from '../lib/getInnodocStaticProps'

function Login() {
  return (
    <Container>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          <LoginIcon sx={{ mr: 2 }} />
          Login
        </Typography>
      </Box>
    </Container>
  )
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async (context): Promise<GetStaticPropsResult<SSRConfig>> => ({
      props: await getInnodocStaticProps(store, context),
    })
)

export default Login
