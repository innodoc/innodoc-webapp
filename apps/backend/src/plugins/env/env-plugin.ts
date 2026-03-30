const makeEnvPlugin = (isProduction: boolean) => (isProduction ? import('./prod.js') : import('./dev.js'))

export default makeEnvPlugin
