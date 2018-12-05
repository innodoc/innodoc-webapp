import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import appSelectors from '../../../../store/selectors/app'

import ContentFragment from '..'

const Image = ({ language, contentRoot, data }) => {
  const [[, classes, ], content, [src, alt]] = data
  const css_classes = (!!classes.length ? '.' : '') + classes.join(' .')
  var display_src = src
  if (!src.startsWith('http')) {
  	display_src = contentRoot
  	if (classes.includes('localized')) {
  		display_src += language + '/'
  	}
	display_src += '_static'
  	if (!src.startsWith('/')) {
  		display_src += '/02-elements/06-media/'
  	}
  	display_src += src
  }

  return (
  	<figure>
    	<img src={display_src} alt={alt} className={css_classes} />
	    <figcaption>
	    	
	    	<ContentFragment content={content} />
	    </figcaption>
	</figure>
  )
}

Image.propTypes = {
  data: PropTypes.arrayOf(PropTypes.array).isRequired,
  contentRoot: PropTypes.string.isRequired,
  language: PropTypes.string.isRequired,
}


const mapStateToProps = state => ({
  contentRoot: appSelectors.getContentRoot(state),
  language: appSelectors.getLanguage(state)
})

export default connect(mapStateToProps)(Image)
