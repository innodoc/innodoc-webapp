import { Box, Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { AppLink } from '#components/common/links'
import { PageHeader } from '#components/common/misc'

function LoginPage() {
  const { t } = useTranslation()

  // TODO
  const onSubmit = () => undefined

  return (
    <>
      <PageHeader iconName="mdi:login">{t('builtinPages.login.title')}</PageHeader>
      <Box sx={{ mx: 'auto', width: { xs: 1, sm: '24rem' } }}>
        <Box component="form" noValidate onSubmit={onSubmit}>
          <TextField
            autoComplete="email"
            autoFocus
            fullWidth
            id="login-email"
            label={t('builtinPages.login.email')}
            margin="normal"
            name="login-email"
            required
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            id="login-password"
            label={t('builtinPages.login.password')}
            margin="normal"
            name="login-password"
            required
            type="password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={t('builtinPages.login.rememberMe')}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {t('builtinPages.login.signIn')}
          </Button>
          <Grid container>
            <Grid item sm xs={12}>
              <AppLink routeInfo={{ routeName: 'app:user:forgot-password' }} variant="body2">
                {t('builtinPages.login.forgotPassword')}
              </AppLink>
            </Grid>
            <Grid item sm="auto" xs={12}>
              <AppLink routeInfo={{ routeName: 'app:user:sign-up' }} variant="body2">
                {t('builtinPages.login.signUpLink')}
              </AppLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage
