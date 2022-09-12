import { SvgIcon as MuiSvgIcon, type SxProps, type Theme } from '@mui/material'
import { type ComponentProps } from 'react'

import buildData from '@/__buildData.json'

import SvgNode, { isElementNode } from './SvgNode'

const { iconBundle } = buildData

function Icon({ name, ...other }: IconProps) {
  const icon = iconBundle[name]
  if (icon === undefined) {
    throw new Error(`Unknown icon name: ${name}`)
  }

  const svgNode = icon.children[0]
  if (!isElementNode(svgNode) || svgNode.tagName !== 'svg') {
    throw new Error('Invalid root node')
  }

  const viewBox =
    typeof svgNode?.properties?.viewBox === 'string' ? svgNode.properties.viewBox : '0 0 24 24'

  const children = svgNode.children
    .map((node, idx) => {
      return isElementNode(node) ? <SvgNode key={idx} node={node} /> : false
    })
    .filter(Boolean)

  return (
    <MuiSvgIcon viewBox={viewBox} {...other}>
      {children}
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
  name: keyof typeof iconBundle
  sx?: SxProps<Theme>
}

type FontSize = ComponentProps<typeof MuiSvgIcon>['fontSize']

export default Icon
