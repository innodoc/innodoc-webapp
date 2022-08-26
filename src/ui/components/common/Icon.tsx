import { SvgIcon as MuiSvgIcon, type SxProps, type Theme } from '@mui/material'
import { type ComponentProps } from 'react'

import SvgNode, { isElementNode } from './SvgNode'

const iconData = import.meta.env.INNODOC_ICON_DATA

function Icon({ name, ...other }: IconProps) {
  const icon = iconData[name]
  if (icon === undefined) {
    throw new Error(`Unknown icon name: ${name}`)
  }

  const svgNode = icon.children[0]
  if (!isElementNode(svgNode) || svgNode.tagName !== 'svg') {
    throw new Error('Invalid root node')
  }

  const viewBox =
    typeof svgNode?.properties?.viewBox === 'string' ? svgNode.properties.viewBox : '0 0 24 24'

  return (
    <MuiSvgIcon viewBox={viewBox} {...other}>
      {svgNode.children.map((node, idx) => (
        <SvgNode key={idx} node={node} />
      ))}
    </MuiSvgIcon>
  )
}

type IconProps = {
  fontSize?: FontSize
  /**
   * Icon name as defined in icon bundle (e.g. `mdi:home`) or SVG file
   * referencing static content file (e.g. `file:logo.svg`).
   *
   * See https://icon-sets.iconify.design/mdi/ for available icons.
   */
  name: string
  sx?: SxProps<Theme>
}

type FontSize = ComponentProps<typeof MuiSvgIcon>['fontSize']

export default Icon
