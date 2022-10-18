import { SvgIcon as MuiSvgIcon, type SxProps, type Theme } from '@mui/material'
import { type ComponentProps } from 'react'

import buildData from '@/__buildData.json'

import InlineError from './InlineError'
import SvgNode, { isElementNode } from './SvgNode'

const { iconBundle } = buildData

function Icon({ name, ...other }: IconProps) {
  const icon = iconBundle[name]
  if (icon === undefined) {
    return <InlineError>Icon: Unknown icon name: {name}</InlineError>
  }

  const svgNode = icon.children[0]
  if (!isElementNode(svgNode) || svgNode.tagName !== 'svg') {
    return <InlineError>Icon: Invalid root node</InlineError>
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

export type IconProps = {
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
