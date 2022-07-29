import { Login as LoginIcon } from '@mui/icons-material'
import { Box, Container, Typography } from '@mui/material'
import type { GetStaticPropsResult } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

import { changeLocale, contentApi, selectCourseTitle, useSelector, wrapper } from '@innodoc/store'

function Login() {
  const title = useSelector(selectCourseTitle)

  return (
    <Container>
      <Box>
        <Typography variant="h4" component="h1" gutterBottom>
          <LoginIcon sx={{ mr: 2 }} />
          Login {title}
        </Typography>
      </Box>
    </Container>
  )
}

export const getStaticProps = wrapper.getStaticProps(
  (store) =>
    async ({ locale }): Promise<GetStaticPropsResult<Record<string, never>>> => {
      let props = {}

      // Setup i18n
      if (locale !== undefined) {
        store.dispatch(changeLocale(locale))
        props = { ...(await serverSideTranslations(locale, ['common'])) }
      }

      // Fetch manifest
      void store.dispatch(contentApi.endpoints.getManifest.initiate())
      await Promise.all(contentApi.util.getRunningOperationPromises())

      return { props }
    }
)

export default Login
