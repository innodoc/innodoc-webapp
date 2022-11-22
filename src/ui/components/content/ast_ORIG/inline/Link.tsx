import { Link as MuiLink, styled } from '@mui/material'

import { type BuiltinPagesKey, BUILTIN_PAGES_KEYS } from '#constants'
import Icon from '#ui/components/common/Icon'
import BuiltinPageLink from '#ui/components/common/link/BuiltinPageLink'
import ContentLink from '#ui/components/common/link/ContentLink'
import ContentTree from '#ui/components/content/ast/ContentTree'
import type { ContentComponentProps } from '#ui/components/content/ast/types'

function isBuiltinPagesKey(key: string): key is BuiltinPagesKey {
  return BUILTIN_PAGES_KEYS.includes(key as BuiltinPagesKey)
}

const StyledSup = styled('sup')({
  verticalAlign: 'top',
  '& .MuiSvgIcon-root': { fontSize: 'inherit' },
})

function Link({ content: [[, classes], content, [href, title]] }: ContentComponentProps<'Link'>) {
  if (classes.includes('video')) {
    // TODO
    // return <Video data={data} />
    return null
  }

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

  // mailto link same page
  if (href.startsWith('mailto:')) {
    return (
      <MuiLink href={href} title={title}>
        <ContentTree content={content} />
        <StyledSup>
          <Icon name="mdi:email" />
        </StyledSup>
      </MuiLink>
    )
  }

  // Hash reference on same page
  if (href.startsWith('#')) {
    return (
      <MuiLink href={href} title={title}>
        <ContentTree content={content} />
      </MuiLink>
    )
  }

  // Built-in page link/content link
  const children = content && content.length ? <ContentTree content={content} /> : undefined
  return isBuiltinPagesKey(href) ? (
    <BuiltinPageLink to={href}>{children}</BuiltinPageLink>
  ) : (
    <ContentLink to={href}>{children}</ContentLink>
  )
}

export default Link
