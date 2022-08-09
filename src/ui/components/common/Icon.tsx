import {
  Icon as MuiIcon,
  styled,
  SvgIcon as MuiSvgIcon,
  type SxProps,
  type Theme,
} from '@mui/material'
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

function SvgIcon({ name, sx }: SvgIconProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = getIconDataFromBundle(name)
    }
  }, [name])

  return <MuiSvgIcon ref={svgRef} sx={sx} />
}

type SvgIconProps = {
  /**
   * Icon name as defined in icon bundle.
   *
   * https://icon-sets.iconify.design/mdi/
   */
  name: string
  sx?: SxProps<Theme>
}

const StyledImg = styled('img')({
  display: 'flex',
  height: 'inherit',
  width: 'inherit',
})

function SvgFileIcon({ filename, sx }: SvgFileIconProps) {
  return (
    <MuiIcon sx={sx}>
      <StyledImg src={`${import.meta.env.INNODOC_CONTENT_ROOT}_static/${filename}`} />
    </MuiIcon>
  )
}

type SvgFileIconProps = {
  /** Icon file name referencing file in course `_static` folder. */
  filename: string
  sx?: SxProps<Theme>
}

function Icon({ name, sx }: IconProps) {
  if (name.startsWith('mdi:')) {
    return <SvgIcon name={name.replace(/^mdi:/, '')} sx={sx} />
  }

  if (name.startsWith('file:')) {
    return <SvgFileIcon filename={name.replace(/^file:/, '')} sx={sx} />
  }

  throw Error('Icon `name` prop must start with `mdi:..` or `file:...`.')
}

type IconProps = {
  /** Icon name, either `mdi:...` or `file:...`. */
  name: string
  sx?: SxProps<Theme>
}

export default Icon
