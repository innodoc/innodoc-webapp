import { styled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ReactNode } from 'react'

import type { VIDEO_PROPERTIES } from '@innodoc/content-parser/properties'

import type { NodeProps } from '#types'

const StyledVideo = styled('video')(({ theme }) => ({
  margin: theme.spacing(2, 0),
  width: '100%',
}))

function Video({ children, id, nodeProps }: VideoProps) {
  const { t } = useTranslation()

  let title: string | undefined
  if (Array.isArray(children) && children.length > 0) {
    const firstChild = children[0] as unknown
    if (typeof firstChild === 'string') {
      title = firstChild
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

export default Video
