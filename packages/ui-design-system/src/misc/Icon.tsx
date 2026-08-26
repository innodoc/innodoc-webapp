import type { SxProps, Theme } from '@mui/material'
import { SvgIcon as MuiSvgIcon } from '@mui/material'
import { type ComponentProps } from 'react'
import { Trans } from 'react-i18next'
import type { IconName } from '@innodoc/shared-core/icons'
import { InlineError } from '#errors'
import iconBundle from '#icon-bundle' with { type: 'json' }
import Code from './Code.js'

const iconNames: ReadonlySet<string> = new Set(Object.getOwnPropertyNames(iconBundle))

function isIconName(name: string): name is IconName {
  return iconNames.has(name)
}

function Icon({ name, ...other }: IconProps) {
  const pathData = isIconName(name) ? iconBundle[name] : undefined

  if (typeof pathData === 'string') {
    return (
      <MuiSvgIcon viewBox="0 0 24 24" {...other}>
        <path d={pathData} fill="currentColor" />
      </MuiSvgIcon>
    )
  }

  return (
    <InlineError>
      <Trans i18nKey="error.unknownIcon" components={{ 1: <Code /> }} values={{ name }}>
        {`Unknown icon: <1>{{name}}</1>`}
      </Trans>
    </InlineError>
  )
}

interface IconProps {
  fontSize?: ComponentProps<typeof MuiSvgIcon>['fontSize']
  /**
   * Icon name as defined in the `ICON_NAMES` manifest (`@innodoc/shared-core/icons`),
   * e.g. `mdi:home`.
   *
   * See https://icon-sets.iconify.design/mdi/ for available icons.
   */
  name: IconName
  sx?: SxProps<Theme>
}

export type { IconProps }
export default Icon
