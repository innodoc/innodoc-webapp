import { Skeleton, styled } from '@mui/material'
import { useEffect } from 'react'

import { useLazyGetSvgQuery } from '@/store/slices/staticCache'
import InlineError from '@/ui/components/common/InlineError'
import SvgRootNode from '@/ui/components/common/SvgRootNode'

const StyledSvg = styled('svg')({
  color: 'var(--mui-palette-text-primary)',
  maxWidth: '100%',
})

function SvgImage({ id }: SvgImageProps) {
  const [trigger, { data: rootNode, isError }] = useLazyGetSvgQuery()

  useEffect(() => {
    // Only fetch client-side, on server the cache is always prepopulated
    void trigger({ id }, true)
  }, [id, trigger])

  if (isError) {
    return <InlineError>Failed to fetch SVG!</InlineError>
  }

  if (rootNode === undefined) {
    return <Skeleton sx={{ mb: 2 }} variant="rectangular" />
  }

  return <SvgRootNode component={StyledSvg} rootNode={rootNode} />
}

type SvgImageProps = {
  id: string
}

export default SvgImage
