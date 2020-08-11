import { insert } from 'mathjax-full/js/util/Options'

import courseSelectors from '@innodoc/client-store/src/selectors/course'

import createHoc from './createHoc'

const ORIGIN = process.browser ? window.location.origin : ''
const DEFAULT_MATHJAX_FONT_URL = `${ORIGIN}/fonts/mathjax-woff-v2`

const withMathJaxOptions = createHoc('WithMathJaxOptions', (ctx) => {
  const props = {}
  const course = courseSelectors.getCurrentCourse(ctx.store.getState())
  const defaultMathJaxOptions = {
    chtml: { fontURL: DEFAULT_MATHJAX_FONT_URL },
  }
  try {
    props.mathJaxOptions = insert(defaultMathJaxOptions, course.mathJaxOptions, false)
  } catch (error) {
    props.mathJaxOptions = defaultMathJaxOptions
  }
  return props
})

export default withMathJaxOptions
