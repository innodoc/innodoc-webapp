import { Skeleton, styled } from '@mui/material'
import { useTranslation } from 'react-i18next'

import { useGetSvgQuery } from '#store/slices/staticCache'
import InlineError from '#ui/components/common/error/InlineError'
import SvgRootNode from '#ui/components/common/SvgRootNode'

const StyledSvg = styled('svg')({
  color: 'var(--mui-palette-text-primary)',
  maxWidth: '100%',
})

function SvgImage({ id }: SvgImageProps) {
  const { t } = useTranslation()
  const { data: rootNode, isError } = useGetSvgQuery({ id })

  if (isError) {
    return <InlineError>{t('error.svgFetchFailed')}</InlineError>
  }

  if (rootNode === undefined) {
    return <Skeleton sx={{ mb: 2 }} variant="rectangular" />
  }

  return <SvgRootNode component={StyledSvg} rootNode={rootNode} />
}

interface SvgImageProps {
  id: string
}

export default SvgImage