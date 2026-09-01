import type { ComponentType, ReactNode } from 'react'
import { isHastMdxJsxTextSpanElement } from '@innodoc/content-parser/typeguards'
import type { HastMdxJsxTextSpanElement } from '@innodoc/content-parser/types'
import type { HastComponentProps } from '#hast'

interface SpanComponentProps {
  children: ReactNode
  id?: string
  nodeProps: HastMdxJsxTextSpanElement['properties']
}

type SpanComponent = ComponentType<SpanComponentProps>

// `TextQuestion` is deliberately absent from this map: its field root is a block element (MUI
// TextField renders div.MuiFormControl-root), and an inline MDX element lives inside a <p>, so
// dispatching it would place a div inside the paragraph - invalid DOM nesting that a browser's
// HTML parser repairs by splitting the paragraph (React reports it as a hydration error).
// Until the widget has an inline-safe (span-level) field root, inline questions take the bare
// span fallback below and render the authored prompt text as plain content. Re-activation is
// the one-line map entry once that root exists.
const flowSpanComponentMap: Partial<Record<HastMdxJsxTextSpanElement['properties']['name'], SpanComponent>> = {}

function SpanNode({ children, id, node, ...other }: HastComponentProps<'span'>) {
  if (isHastMdxJsxTextSpanElement(node)) {
    // At runtime `name` can be any authored JSX tag (a raw `<span>` written in MDX parses as a
    // text element named `span`), so unmapped names fall back to the bare span below.
    const Component = flowSpanComponentMap[node.properties.name]

    if (Component) {
      return (
        <Component id={id} nodeProps={node.properties}>
          {children}
        </Component>
      )
    }
  }

  // Pass props for KaTeX nodes
  return <span {...other}>{children}</span>
}

export default SpanNode
