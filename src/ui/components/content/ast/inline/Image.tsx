import { styled } from '@mui/material'

import type { ContentComponentProps } from '@/ui/components/content/ast/types'
import SvgImage from '@/ui/components/content/misc/SvgImage'
import { astToString } from '@/utils/content'

const StyledImage = styled('img')({
  maxWidth: '100%',
})

function Image({ content: [[id], content, [url, title]] }: ContentComponentProps<'Image'>) {
  const src = /^https?:\/\//i.test(url) ? url : `${import.meta.env.INNODOC_STATIC_ROOT}${url}`
  const alt = title || astToString(content)

  if (src.endsWith('.svg')) {
    return <SvgImage src={src} />
  }

  return <StyledImage alt={alt} id={id} src={src} />
}

export default Image
