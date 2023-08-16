import { Box, styled } from '@mui/material'
import { Children, type ReactNode } from 'react'
import type { YOUTUBE_VIDEO_PROPERTIES } from '@innodoc/markdown/properties'

import { selectRouteInfo } from '@innodoc/store/slices/app'

import { useSelector } from '#hooks/store'
import type { NodeProps } from '#components/content/types'

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

  let title: string | undefined = undefined
  const childrenArr = Children.toArray(children)
  if (childrenArr.length >= 1) {
    const child = childrenArr[0]
    if (typeof child === 'string') {
      title = child
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
