import { Box, Button, Checkbox, FormControlLabel, Grid, Link, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

import InternalLink from '#ui/components/common/link/InternalLink'
import PageHeader from '#ui/components/common/PageHeader'

function Page() {
  const { t } = useTranslation()

  // TODO
  const onSubmit = () => undefined

  return (
    <>
      <PageHeader iconName="mdi:login">{t('internalPages.login.title')}</PageHeader>
      <Box sx={{ mx: 'auto', width: { xs: 1, sm: '24rem' } }}>
        <Box component="form" noValidate onSubmit={onSubmit}>
          <TextField
            autoComplete="email"
            autoFocus
            fullWidth
            id="login-email"
            label={t('internalPages.login.email')}
            margin="normal"
            name="login-email"
            required
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            id="login-password"
            label={t('internalPages.login.password')}
            margin="normal"
            name="login-password"
            required
            type="password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={t('internalPages.login.rememberMe')}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {t('internalPages.login.signIn')}
          </Button>
          <Grid container>
            <Grid item sm xs={12}>
              <Link component={InternalLink} to="/forgot-password" variant="body2">
                {t('internalPages.login.forgotPassword')}
              </Link>
            </Grid>
            <Grid item sm="auto" xs={12}>
              <Link component={InternalLink} to="/sign-up" variant="body2">
                {t('internalPages.login.signUpLink')}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export { Page }
