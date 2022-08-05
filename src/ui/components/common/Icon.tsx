import { SvgIcon, type SvgIconProps } from '@mui/material'
import { useEffect, useRef } from 'react'

const { icons } = import.meta.env.INNODOC_ICON_DATA

function getIconData(iconName: string) {
  try {
    return icons[iconName].body
  } catch {
    console.warn(`Unknown icon name: '${iconName}'`)
    return ''
  }
}

function Icon({ name, ...other }: IconProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = getIconData(name)
    }
  }, [name])

  return <SvgIcon ref={svgRef} {...other} />
}

type IconProps = SvgIconProps & {
  /**
   * Icon name as defined in icon bundle.
   *
   * https://icon-sets.iconify.design/mdi/
   */
  name: string
}

export default Icon
