import { Box, Button, Checkbox, FormControlLabel, Grid, TextField } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { AppLink } from '@innodoc/ui-design-system/links'
import { PageHeader } from '@innodoc/ui-design-system/misc'

// TODO
const onSubmit = () => {
  // pass
}

function LoginPage() {
  const { t } = useTranslation()

  return (
    <>
      <PageHeader iconName="mdi:login">{t('pages.user.login.title')}</PageHeader>
      <Box sx={{ mx: 'auto', width: { xs: 1, sm: '24rem' } }}>
        <Box component="form" noValidate onSubmit={onSubmit}>
          <TextField
            autoComplete="email"
            fullWidth
            id="login-email"
            label={t('pages.user.login.email')}
            margin="normal"
            name="login-email"
            required
          />
          <TextField
            autoComplete="current-password"
            fullWidth
            id="login-password"
            label={t('pages.user.login.password')}
            margin="normal"
            name="login-password"
            required
            type="password"
          />
          <FormControlLabel
            control={<Checkbox value="remember" color="primary" />}
            label={t('pages.user.login.rememberMe')}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            {t('pages.user.login.signIn')}
          </Button>
          <Grid container>
            <Grid item sm xs={12}>
              <AppLink routeInfo={{ name: 'app:user:forgot-password' }} variant="body2">
                {t('pages.user.login.forgotPassword')}
              </AppLink>
            </Grid>
            <Grid item sm="auto" xs={12}>
              <AppLink routeInfo={{ name: 'app:user:sign-up' }} variant="body2">
                {t('pages.user.login.signUpLink')}
              </AppLink>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </>
  )
}

export default LoginPage
