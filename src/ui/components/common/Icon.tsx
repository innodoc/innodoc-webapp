import { SvgIcon as MuiSvgIcon, type SxProps, type Theme } from '@mui/material'
import { type ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'

import iconBundle from '#build/iconBundle.json'

import InlineError from './error/InlineError'
import SvgRootNode from './SvgRootNode'

function Icon({ name, ...other }: IconProps) {
  const { t } = useTranslation()

  const icon = iconBundle[name]
  if (icon === undefined) {
    return (
      <InlineError>
        {t('error.unknownIcon')}: <code>{name}</code>
      </InlineError>
    )
  }

  const viewBox =
    typeof icon?.children?.[0]?.properties?.viewBox === 'string'
      ? icon.children[0].properties.viewBox
      : '0 0 24 24'

  return <SvgRootNode component={MuiSvgIcon} rootNode={icon} viewBox={viewBox} {...other} />
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
