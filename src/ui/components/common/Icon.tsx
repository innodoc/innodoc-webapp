import {
  // eslint-disable-next-line @typescript-eslint/no-restricted-imports
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

function SvgIcon({ fontSize, name, sx }: SvgIconProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (svgRef.current) {
      svgRef.current.innerHTML = getIconDataFromBundle(name)
    }
  }, [name])

  return <MuiSvgIcon fontSize={fontSize} ref={svgRef} sx={sx} />
}

type SvgIconProps = {
  fontSize?: FontSize
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

function Icon({ fontSize, name, sx }: IconProps) {
  if (name.startsWith('mdi:')) {
    return <SvgIcon fontSize={fontSize} name={name.replace(/^mdi:/, '')} sx={sx} />
  }

  if (name.startsWith('file:')) {
    return <SvgFileIcon filename={name.replace(/^file:/, '')} sx={sx} />
  }

  throw Error('Icon `name` prop must start with `mdi:..` or `file:...`.')
}

type IconProps = {
  fontSize?: FontSize
  /** Icon name, either `mdi:...` or `file:...`. */
  name: string
  sx?: SxProps<Theme>
}

type FontSize = 'inherit' | 'large' | 'medium' | 'small'

export default Icon
