import { Typography } from '@mui/material'

import Link from '@/ui/components/common/Link'

function TestPage() {
  return (
    <>
      <Typography variant="h2">Just a test ONE</Typography>
      <Link href="/de/test2">Link to /test2</Link>
    </>
  )
}

export { TestPage as Page }
