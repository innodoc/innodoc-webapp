import tmp from 'tmp'

tmp.setGracefulCleanup()

export const antdExtractedVarsTmp = tmp.fileSync({
  discardDescriptor: true,
  mode: 0o600,
  postfix: '.json',
  prefix: 'innodoc-antd-extracted-vars',
})
