import type { Config } from 'vike/types'

import { PASS_TO_CLIENT_PROPS } from '@innodoc/constants'

export default {
  clientRouting: true,
  hydrationCanBeAborted: true, // true for React
  passToClient: [...PASS_TO_CLIENT_PROPS],
  meta: {
    onInit: {
      env: {
        client: false,
        server: true,
      },
    },
  },
} satisfies Config
