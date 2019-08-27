import React, { useState } from 'react'
import classNames from 'classnames'
import Affix from 'antd/lib/affix'

import css from './style.sass'
import Breadcrumb from './Breadcrumb'
import AffixButtons from './AffixButtons'

const ContentAffix = () => {
  const [affixed, setAffixState] = useState(false)
  const affixClassNames = classNames(
    css.sectionAffix,
    'clearfix',
    { [css.affixed]: affixed }
  )

  return (
    <Affix onChange={(newAffixed) => setAffixState(newAffixed)}>
      <div className={affixClassNames}>
        <Breadcrumb />
        <AffixButtons />
      </div>
    </Affix>
  )
}

export default ContentAffix
