import { SvgIcon as MuiSvgIcon, type SvgIconProps as MuiSvgIconProps } from '@mui/material'
import { useEffect, useRef } from 'react'

const { icons } = import.meta.env.INNODOC_ICON_DATA

function getIconDataFromBundle(iconName: string) {
  try {
    return icons[iconName].body
  } catch {
    console.warn(`Unknown icon name: '${iconName}'`)
    return ''
  }
}

function SvgIcon({ name, ...other }: SvgIconProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = getIconDataFromBundle(name)
    }
  }, [name])

  return <MuiSvgIcon ref={svgRef} {...other} />
}

type SvgIconProps = MuiSvgIconPropsWithoutChildren & {
  /**
   * Icon name as defined in icon bundle.
   *
   * https://icon-sets.iconify.design/mdi/
   */
  name: string
}

function SvgFileIcon({ filename, ...other }: SvgFileIconProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // TODO: import filename dynamically?
    console.log('filename', filename)
  }, [filename])

  return <MuiSvgIcon ref={svgRef} {...other} />
}

type SvgFileIconProps = MuiSvgIconPropsWithoutChildren & {
  /** Icon file name referencing file in course `_static` folder. */
  filename: string
}

function Icon({ name, ...other }: IconProps) {
  if (name.startsWith('mdi:')) {
    return <SvgIcon name={name.replace(/^mdi:/, '')} {...other} />
  }

  if (name.startsWith('file:')) {
    return <SvgFileIcon filename={name.replace(/^file:/, '')} {...other} />
  }

  throw Error('Icon `name` prop must start with `mdi:..` or `file:...`.')
}

type IconProps = MuiSvgIconPropsWithoutChildren & {
  /** Icon name, either `mdi:...` or `file:...`. */
  name: string
}

/** Forbid any children as we mess with components innerHTML. */
type MuiSvgIconPropsWithoutChildren = Omit<MuiSvgIconProps, 'children'>

export default Icon
