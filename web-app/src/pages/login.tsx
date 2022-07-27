import { Login as LoginIcon } from '@mui/icons-material'
import { Box, Container, Typography } from '@mui/material'

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

export default Login
