import { Link, styled, Typography } from '@mui/material'
import type { Node } from 'svg-parser'

import { selectCourseTitle } from '@/store/selectors/content/course'
import HomeLink from '@/ui/components/common/link/HomeLink'
import SvgElementNode, { isElementNode } from '@/ui/components/common/SvgNode'
import { useSelector } from '@/ui/hooks/store'

const logoData = import.meta.env.INNODOC_LOGO_DATA

const StyledSvg = styled('svg')({
  color: 'var(--mui-palette-text-primary)',
  height: '1em',
  userSelect: 'none',
  width: 'auto',
  fill: 'currentColor',
})

function SvgLogo({ svgNode }: SvgLogoProps) {
  if (!isElementNode(svgNode) || svgNode.tagName !== 'svg') throw new Error('Invalid root node')

  const viewBox =
    typeof svgNode?.properties?.viewBox === 'string' ? svgNode.properties.viewBox : '0 0 24 24'

  return (
    <StyledSvg viewBox={viewBox}>
      {svgNode.children.map((child, idx) => (
        <SvgElementNode key={idx} node={child} />
      ))}
    </StyledSvg>
  )
}

type SvgLogoProps = {
  svgNode: Node
}

function Logo() {
  const title = useSelector(selectCourseTitle)

  const content =
    logoData === undefined ? (
      <Typography variant="h6" color="inherit" noWrap>
        {title}
      </Typography>
    ) : (
      <SvgLogo svgNode={logoData.children[0]} />
    )

  return (
    <Link component={HomeLink} sx={{ display: 'inline-flex' }} title={title}>
      {content}
    </Link>
  )
}

export default Logo
