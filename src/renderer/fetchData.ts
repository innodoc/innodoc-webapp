import type { Store } from '@/store/makeStore'
import contentApi from '@/store/slices/contentApi'

async function loadManifest(store: Store) {
  void store.dispatch(contentApi.endpoints.getManifest.initiate())
  return Promise.all(contentApi.util.getRunningOperationPromises())
}

export { loadManifest }
