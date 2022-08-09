import { Link as MuiLink, styled } from '@mui/material'

import Icon from '@/ui/components/common/Icon'
import ContentTree from '@/ui/components/content/ContentTree'
import type { ContentComponentProps } from '@/ui/components/content/elt/types'

const StyledSup = styled('sup')({
  verticalAlign: 'top',
  '& .MuiSvgIcon-root': { fontSize: 'inherit' },
})

function Link({ content: [[, classes], content, [href, title]] }: ContentComponentProps<'Link'>) {
  // TODO
  // if (classes.includes('video')) {
  //   return <Video data={data} />
  // }

  // External link
  if (/^https?:\/\//i.test(href)) {
    return (
      <MuiLink href={href} title={title}>
        <ContentTree content={content} />
        <StyledSup>
          <Icon name="mdi:open-in-new" />
        </StyledSup>
      </MuiLink>
    )
  }

  // mailto link/hash reference on same page
  if (href.startsWith('mailto:') || href.startsWith('#')) {
    return (
      <MuiLink href={href} title={title}>
        <ContentTree content={content} />
        <StyledSup>
          <Icon name="mdi:email" />
        </StyledSup>
      </MuiLink>
    )
  }

  // TODO
  // Internal link
  // return content && content.length ? (
  //   <InternalLink href={href}>
  //     <a>
  //       <ContentFragment content={content} />
  //     </a>
  //   </InternalLink>
  // ) : (
  //   <InternalLink href={href} />
  // )

  return null
}

export default Link
