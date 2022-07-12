const { PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER } = require('next/constants')

module.exports = async (phase, config) => {
  if ([PHASE_DEVELOPMENT_SERVER, PHASE_PRODUCTION_SERVER].includes(phase)) {
    const { api } = await import('@innodoc/client-misc')

    return {
      ...config,
      courseManifest: await api.fetchManifest(),
    }
  }

  return config
}
