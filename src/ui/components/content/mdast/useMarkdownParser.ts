import { useMemo } from 'react'

import MarkdownParser from '#markdown/MarkdownParser'
import type { MarkdownDoc } from '#types/entities/markdown'

const parser = new MarkdownParser()

function useMarkdownParser(source: string): MarkdownDoc {
  return useMemo(() => parser.parse(source), [source])
}

export default useMarkdownParser
