import { SvgIcon as MuiSvgIcon, type SxProps, type Theme } from '@mui/material'
import { type ComponentProps } from 'react'
import { Trans } from 'react-i18next'

import iconBundle from '@innodoc/icon-bundle/iconBundle' assert { type: 'json' }
import type { IconName } from '@innodoc/icon-bundle/types'

import { InlineError } from '#components/common/errors'

import Code from './Code'

function Icon({ name, ...other }: IconProps) {
  const pathData = iconBundle[name]

  if (typeof pathData !== 'string') {
    return (
      <InlineError>
        <Trans i18nKey="error.unknownIcon" components={{ 1: <Code /> }} values={{ name }}>
          {`Unknown icon name encountered: <1>{{name}}</1>`}
        </Trans>
      </InlineError>
    )
  }

  return (
    <MuiSvgIcon viewBox="0 0 24 24" {...other}>
      <path d={pathData} fill="currentColor" />
    </MuiSvgIcon>
  )
}

interface IconProps {
  fontSize?: ComponentProps<typeof MuiSvgIcon>['fontSize']
  /**
   * Icon name as defined in icon bundle (e.g. `mdi:home`) or SVG file
   * referencing static content file (e.g. `file:logo.svg`).
   *
   * See https://icon-sets.iconify.design/mdi/ for available icons.
   */
  name: IconName
  sx?: SxProps<Theme>
}

export default Icon
