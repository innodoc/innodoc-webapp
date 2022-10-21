import { Card, CardMedia, styled } from '@mui/material'

import type { DivProps } from '@/ui/components/content/ast/block/Div'
import ContentTree from '@/ui/components/content/ast/ContentTree'
import Image from '@/ui/components/content/ast/inline/Image'
import { unwrapPara } from '@/utils/content'

const StyledFigcaption = styled('figcaption')(({ theme }) => ({
  color: theme.vars.palette.text.secondary,
  fontStyle: 'italic',
  padding: theme.spacing(0, 1, 1),
}))

function Figure({ content }: DivProps) {
  if (content.length < 1) {
    return null
  }

  const unwrapped = unwrapPara(content)[0]
  if (Array.isArray(unwrapped) || unwrapped.t !== 'Image') {
    return null
  }

  const imgData = unwrapped.c

  const [, captionContent] = imgData
  const caption = captionContent.length ? (
    <StyledFigcaption>
      <ContentTree content={captionContent} />
    </StyledFigcaption>
  ) : null

  return (
    <Card
      component="figure"
      elevation={1}
      sx={{
        backgroundColor: (theme) => theme.vars.palette.TransparentPaper.bg,
        mx: 0,
        my: 2,
        textAlign: 'center',
      }}
    >
      <CardMedia sx={{ mt: 2, px: 2 }}>
        <Image content={imgData} />
      </CardMedia>
      {caption}
    </Card>
  )
}

export default Figure
