import React from 'react'
import { Box } from '@material-ui/core'
import { CustomButton } from './CustomButton'
import {
  getBuildingIncome,
  getBuildingProgress,
  getNextUpgradeCost,
  getNextLevelCost,
} from '../utils/buildings'
import numeral from 'numeral'

export function BuildingItem({ building, onClickLevel, onClickUpgrade }) {
  return (
    <Box display="flex" flex={1}>
      <CustomButton
        label={building.label}
        value={numeral(getBuildingIncome(building)).format('0,0.00')}
        progress={getBuildingProgress(building)}
        flex={2}
      />
      <CustomButton
        label={`level ${building.level}`}
        value={numeral(getNextLevelCost(building)).format('0,0.00')}
        onClick={onClickLevel}
      />
      <CustomButton
        label={`upgrade ${building.upgrade}`}
        value={numeral(getNextUpgradeCost(building)).format('0,0.00')}
        onClick={onClickUpgrade}
      />
    </Box>
  )
}
