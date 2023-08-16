import { Typography } from '@mui/material'
import { Trans, useTranslation } from 'react-i18next'
import type { ParserError } from '@innodoc/types/common'

import { BlockError, CodeBlock } from '#components/common'

function MarkdownParserError({ error }: MarkdownParserErrorProps) {
  const { t } = useTranslation()

  return (
    <BlockError title={t('error.markdownParsingError.title')}>
      <Trans
        i18nKey="error.markdownParsingError.message"
        components={{ 1: <strong />, 3: <strong /> }}
        values={{ column: error.column, line: error.line }}
      >
        {`There was an error in the Markdown code on line <1>{{line}}</1>, column <3>{{column}}</3>.`}
      </Trans>
      <p>
        Rule: <Typography variant="code">{error.ruleId}</Typography>
        <br />
        Source: <Typography variant="code">{error.source}</Typography>
      </p>
      <CodeBlock wrap>{error.reason}</CodeBlock>
    </BlockError>
  )
}

interface MarkdownParserErrorProps {
  error: ParserError
}

export default MarkdownParserError
