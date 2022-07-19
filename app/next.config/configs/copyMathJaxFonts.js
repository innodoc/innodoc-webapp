import fs from 'fs/promises'
import { createRequire } from 'module'
import path from 'path'

const require = createRequire(import.meta.url)

const fontFiles = [
  'MathJax_AMS-Regular.woff',
  'MathJax_Calligraphic-Bold.woff',
  'MathJax_Calligraphic-Regular.woff',
  'MathJax_Fraktur-Bold.woff',
  'MathJax_Fraktur-Regular.woff',
  'MathJax_Main-Bold.woff',
  'MathJax_Main-Italic.woff',
  'MathJax_Main-Regular.woff',
  'MathJax_Math-BoldItalic.woff',
  'MathJax_Math-Italic.woff',
  'MathJax_Math-Regular.woff',
  'MathJax_SansSerif-Bold.woff',
  'MathJax_SansSerif-Italic.woff',
  'MathJax_SansSerif-Regular.woff',
  'MathJax_Script-Regular.woff',
  'MathJax_Size1-Regular.woff',
  'MathJax_Size2-Regular.woff',
  'MathJax_Size3-Regular.woff',
  'MathJax_Size4-Regular.woff',
  'MathJax_Typewriter-Regular.woff',
  'MathJax_Vector-Bold.woff',
  'MathJax_Vector-Regular.woff',
  'MathJax_Zero.woff',
]

const outputPath = path.resolve(
  new URL('.', import.meta.url).pathname,
  '..',
  '..',
  'src',
  'public',
  'fonts',
  'mathjax-woff-v2'
)

export default async (phase, config) => {
  const match = /^(.+\.zip)\//.exec(require.resolve('mathjax-full'))
  if (!match) {
    throw new Error('Could not find mathjax-full package.')
  }

  try {
    await fs.mkdir(outputPath)
  } catch (err) {
    if (!err.message.match('EEXIST')) {
      throw err
    }
  }

  await Promise.all(
    fontFiles.map((file) =>
      fs.copyFile(
        path.join(
          match[1],
          'node_modules',
          'mathjax-full',
          'es5',
          'output',
          'chtml',
          'fonts',
          'woff-v2',
          file
        ),
        path.join(outputPath, file)
      )
    )
  )

  return config
}
