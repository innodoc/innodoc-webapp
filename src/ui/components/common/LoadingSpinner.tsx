import { Box, CircularProgress } from '@mui/material'

function LoadingSpinner() {
  return (
    <Box sx={{ my: 10, textAlign: 'center' }} width={1}>
      <CircularProgress size="4rem" />
    </Box>
  )
}

export default LoadingSpinner
