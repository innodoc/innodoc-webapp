import { Skeleton, styled } from '@mui/material'
import { useEffect, useState } from 'react'
import { parse, type RootNode } from 'svg-parser'

import SvgRootNode from '@/ui/components/common/SvgRootNode'

const StyledSvg = styled('svg')({
  color: 'var(--mui-palette-text-primary)',
  width: '100%',
})

function SvgImage({ src }: SvgImageProps) {
  const [parsedSvg, setParsedSvg] = useState<RootNode>()

  // TODO: cache in store, prepopulate store for SSR
  useEffect(() => {
    fetch(src)
      .then((res) => {
        if (res.status !== 200) {
          throw new Error(`Could not load SVG: ${src}`)
        }
        return res.text()
      })
      .then((svgCode) => {
        setParsedSvg(parse(svgCode))
        return undefined
      })
      .catch((err) => {
        console.error(err)
      })
  }, [src])

  if (parsedSvg === undefined) {
    return <Skeleton sx={{ mb: 2 }} variant="rectangular" />
  }

  return <SvgRootNode component={StyledSvg} rootNode={parsedSvg} />
}

type SvgImageProps = {
  src: string
}

export default SvgImage
