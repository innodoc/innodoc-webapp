// import { Skeleton, styled } from '@mui/material'
// import { useTranslation } from 'react-i18next'

// import { useGetSvgQuery } from '@innodoc/store/slices/staticCache'
// import { InlineError, SvgRootNode } from '#common'

// const StyledSvg = styled('svg')({
//   color: 'var(--mui-palette-text-primary)',
//   maxWidth: '100%',
// })

// TODO: fix SvgImage

// oxlint-disable-next-line @typescript-eslint/no-unused-vars
function SvgImage({ id }: SvgImageProps) {
  // const { t } = useTranslation()
  // const { data: rootNode, isError } = useGetSvgQuery({ id })

  // if (isError) {
  //   return <InlineError>{t('error.svgFetchFailed')}</InlineError>
  // }

  // if (rootNode === undefined) {
  //   return <Skeleton sx={{ mb: 2 }} variant="rectangular" />
  // }

  // return <SvgRootNode component={StyledSvg} rootNode={rootNode} />
  return null
}

interface SvgImageProps {
  id: string
}

export default SvgImage
