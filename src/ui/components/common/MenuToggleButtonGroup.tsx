import { MenuItem, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material'
import type { MouseEvent, ReactNode } from 'react'

const iconSx = { px: 1, py: 0.5 }

function MenuToggleButtonGroup({
  onChange,
  options,
  tooltipText,
  value,
}: MenuToggleButtonGroupProps) {
  return (
    <Tooltip arrow placement="left" title={tooltipText}>
      <MenuItem disableRipple sx={{ justifyContent: 'center' }}>
        <ToggleButtonGroup
          exclusive
          onChange={onChange}
          size="small"
          sx={{ px: 2, py: 0 }}
          value={value}
        >
          {options.map(({ component, label, value }) => (
            <ToggleButton aria-label={label} key={value} sx={iconSx} value={value}>
              {component}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </MenuItem>
    </Tooltip>
  )
}

type MenuToggleButtonGroupProps = {
  onChange: (event: MouseEvent<HTMLElement>, value: string) => void
  options: Option[]
  tooltipText: string
  value: string | null
}

export type Option = {
  component: ReactNode
  label: string
  value: string
}

export default MenuToggleButtonGroup
