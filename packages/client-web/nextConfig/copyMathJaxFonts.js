const fs = require('fs')
const path = require('path')

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

const match = /^(.+\.zip)\//.exec(require.resolve('mathjax-full'))
if (!match) {
  throw new Error('Could not find ZIP package for mathjax-full.')
}

const outputPath = path.resolve(__dirname, '..', 'src', 'public', 'fonts', 'mathjax-woff-v2')
try {
  fs.mkdirSync(outputPath)
} catch (err) {
  if (!err.message.match('EEXIST')) {
    throw err
  }
}

fontFiles.forEach((file) => {
  const filePath = path.join(
    match[1],
    'node_modules',
    'mathjax-full',
    'es5',
    'output',
    'chtml',
    'fonts',
    'woff-v2',
    file
  )
  const buffer = fs.readFileSync(filePath)
  fs.writeFileSync(path.join(outputPath, file), buffer)
})
