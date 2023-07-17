// Ensure single package version for certain packages
// https://github.com/pnpm/pnpm/issues/2713#issuecomment-1141000426

const checkPackages = [
  '@emotion/react',
  '@reduxjs/toolkit',
  'typescript',
  'react',
  'react-dom',
  'react-redux',
  'redux',

  // markdown stuff (this lead to inconsistent versions)
  '@types/mdast',
  'mdast-util-from-markdown',
  'mdast-util-to-string',
  'micromark',
  'micromark-core-commonmark',
  'micromark-factory-destination',
  'micromark-util-character',
  'micromark-util-symbol',
  'micromark-util-types',
  'micromark-factory-label',
  'micromark-factory-space',
  'micromark-factory-title',
  'micromark-factory-whitespace',
  'micromark-util-chunked',
  'micromark-util-classify-character',
  'micromark-util-html-tag-name',
  'micromark-util-normalize-identifier',
  'micromark-util-resolve-all',
  'micromark-util-subtokenize',
  'micromark-util-combine-extensions',
  'micromark-util-decode-numeric-character-reference',
  'micromark-util-encode',
  'micromark-util-sanitize-uri',
  'micromark-util-decode-string',
  'unist-util-stringify-position',
  'mdast-util-to-markdown',
  'mdast-util-phrasing',
  'unist-util-remove-position',
  'vfile-message',
]

// Can be used to check *ALL* packages
// function getAllPackages(packagesKeys) {
//   const pkgNameRegex = /^\/((@[a-z0-9-~][a-z0-9-._~]*\/)?[a-z0-9-~][a-z0-9-._~]*)\//
//   const packageNames = new Set()
//   for (const p of packagesKeys) {
//     const match = pkgNameRegex.exec(p)
//     if (!match) {
//       throw new Error(`Failed to parse packagename: ${p}`)
//     }
//     packageNames.add(match.at(1))
//   }
//   return Array.from(packageNames)
// }

function afterAllResolved(lockfile, context) {
  context.log(`Checking duplicate packages`)

  const packagesKeys = Object.keys(lockfile.packages)
  const enforceSingleVersion = checkPackages
  // const enforceSingleVersion = getAllPackages(packagesKeys)

  const found = {}
  for (const p of packagesKeys) {
    for (const x of enforceSingleVersion) {
      if (p.startsWith(`/${x}/`)) {
        if (found[x]) {
          found[x] += 1
        } else {
          found[x] = 1
        }
      }
    }
  }

  let msg = ''
  for (const p in found) {
    const count = found[p]
    if (count > 1) {
      msg += `${p} found ${count} times\n`
    }
  }

  if (msg) {
    throw new Error(msg)
  }
  return lockfile
}

module.exports = {
  hooks: {
    afterAllResolved,
  },
}
