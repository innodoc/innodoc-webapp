import { Box, Link, Typography } from '@mui/material'

import { selectCourseTitle, useSelector } from '@innodoc/store'

function Footer() {
  const title = useSelector(selectCourseTitle)

  return (
    <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Typography variant="subtitle1" align="center" color="text.secondary" component="p">
        Lorem ipsum footer
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center">
        <Link color="inherit" href="/">
          {title}
        </Link>{' '}
        {new Date().getFullYear()}
      </Typography>
    </Box>
  )
}

export default Footer
