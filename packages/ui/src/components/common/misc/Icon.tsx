import { SvgIcon as MuiSvgIcon, type SxProps, type Theme } from '@mui/material'
import { type ComponentProps } from 'react'
import { Trans } from 'react-i18next'

import iconBundle from '@innodoc/commands/icon-bundle' assert { type: 'json' }

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

export interface IconProps {
  fontSize?: ComponentProps<typeof MuiSvgIcon>['fontSize']
  /**
   * Icon name as defined in icon bundle (e.g. `mdi:home`) or SVG file
   * referencing static content file (e.g. `file:logo.svg`).
   *
   * See https://icon-sets.iconify.design/mdi/ for available icons.
   */
  name: keyof typeof iconBundle
  sx?: SxProps<Theme>
}

export default Icon
