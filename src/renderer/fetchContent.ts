import type { AnyAction, ThunkAction } from '@reduxjs/toolkit'
import type { BaseQueryFn, QueryDefinition } from '@reduxjs/toolkit/dist/query'
import type { QueryActionCreatorResult } from '@reduxjs/toolkit/dist/query/core/buildInitiate'

import type { Store } from '#store/makeStore'

// import staticCache from '#store/slices/staticCache'

// async function fetchSvgImages(store: Store, content: Tree): Promise<void[]> {
//   const promises: Promise<void>[] = []

//   const filterAction = (ele: AnyElt) => {
//     if (ele.t === 'Image') {
//       const id = ele.c[2][0]
//       if (id.endsWith('.svg')) {
//         // Prefetch SVG file
//         promises.push(
//           store
//             .dispatch(staticCache.endpoints.getSvg.initiate({ id }))
//             .then(() => undefined /* Result is saved in store */)
//             .catch((err) => {
//               console.error(`Failed to fetch SVG image ${id}`)
//               console.error(err)
//             })
//         )
//       }
//     }
//   }
//   await walk(content, filterAction, '', {})

//   return Promise.all(promises)
// }

/** Fetch content and contained SVG images */
async function fetchContent(store: Store, action: Action) {
  // Fetch content
  const { data: content, error } = await store.dispatch(action)
  if (error !== undefined) {
    console.error('fetchContent: ', error)
    return
  }
  if (content === undefined) {
    throw new Error('Content fetch returned undefined!')
  }

  // return fetchSvgImages(store, content)
}

type Action = ThunkAction<QueryActionCreatorResult<QD>, unknown, unknown, AnyAction>
type QD = QueryDefinition<unknown, BaseQueryFn, never, string>

export default fetchContent
