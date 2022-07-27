import { Box, Link, Typography } from '@mui/material'

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      <Link color="inherit" href="https://mui.com/">
        Website Title
      </Link>{' '}
      {new Date().getFullYear()}
    </Typography>
  )
}

function Footer() {
  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        Footer
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
        Lorem ipsum footer
      </Typography>
      <Copyright />
    </Box>
  )
}

export default Footer
