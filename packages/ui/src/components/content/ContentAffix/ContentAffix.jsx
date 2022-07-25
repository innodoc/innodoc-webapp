import { Affix } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'

import AffixButtons from './AffixButtons.jsx'
import Breadcrumb from './Breadcrumb.jsx'
import css from './ContentAffix.module.sss'

function ContentAffix() {
  const [affixed, setAffixState] = useState(false)
  const affixClassNames = classNames(css.sectionAffix, 'clearfix', {
    [css.affixed]: affixed,
  })

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
