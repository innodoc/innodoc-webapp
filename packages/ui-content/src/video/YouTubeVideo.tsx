import { Box, styled } from '@mui/material'
import type { ReactNode } from 'react'

import { useSelector } from '@innodoc/ui-store/hooks'
import { selectRouteInfo } from '@innodoc/ui-store/slices/app'
import type { YOUTUBE_VIDEO_PROPERTIES } from '@innodoc/content-parser/properties'

import type { NodeProps } from '#types'

const Wrapper = styled(Box)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  overflow: 'hidden',
  paddingBottom: '56.25%',
  position: 'relative',
  width: '100%',
}))

const StyledIframe = styled('iframe')({
  border: 'none',
  height: '100%',
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
})

function YouTubeVideo({ children, id, nodeProps }: YouTubeVideoProps) {
  const { locale } = useSelector(selectRouteInfo)

  let title: string | undefined
  if (Array.isArray(children) && children.length > 0) {
    const firstChild = children[0] as unknown
    if (typeof firstChild === 'string') {
      title = firstChild
    }
  }

  if (!nodeProps.videoId) {
    return null
  }

  return (
    <Wrapper id={id}>
      <StyledIframe
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        src={`https://www.youtube.com/embed/${nodeProps.videoId}?rel=0&modestbranding=1&hl=${locale}&cc_lang_pref=${locale}`}
        title={title}
      />
    </Wrapper>
  )
}

interface YouTubeVideoProps {
  children: ReactNode
  id?: string
  nodeProps: NodeProps<typeof YOUTUBE_VIDEO_PROPERTIES>
}

export default YouTubeVideo
