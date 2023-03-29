import { styled } from '@mui/material'
import { Children, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'

import type { NodeProps } from '#ui/components/content/types'

const VIDEO_PROPERTIES = ['src'] as const

const StyledVideo = styled('video')(({ theme }) => ({
  margin: theme.spacing(2, 0),
  width: '100%',
}))

function Video({ children, id, nodeProps }: VideoProps) {
  const { t } = useTranslation()

  let title: string | undefined = undefined
  const childrenArr = Children.toArray(children)
  if (childrenArr.length >= 1) {
    const child = childrenArr[0]
    if (typeof child === 'string') {
      title = child
    }
  }

  if (!nodeProps.src) {
    return null
  }

  return (
    <StyledVideo controls id={id} src={nodeProps.src} title={title}>
      {t('content.noHtml5Video')}
    </StyledVideo>
  )
}

interface VideoProps {
  children: ReactNode
  id?: string
  nodeProps: NodeProps<typeof VIDEO_PROPERTIES>
}

export { VIDEO_PROPERTIES }
export default Video
