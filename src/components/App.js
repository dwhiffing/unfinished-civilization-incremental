import React, { useState } from 'react'
import { Box, Container, Typography } from '@material-ui/core'
import { BUILDINGS, INITIAL_MONEY, INTERVAL } from '../utils/constants'
import {
  tickBuildings,
  getIncome,
  getNextLevelCost,
  levelBuilding,
  upgradeBuilding,
  getNextUpgradeCost,
} from '../utils/buildings'
import { useInterval } from '../utils/useInterval'
import { BuildingItem } from './BuildingItem'
import { CustomButton } from './CustomButton'
import numeral from 'numeral'

function App() {
  const [money, setMoney] = useState(INITIAL_MONEY)
  const [buildings, setBuildings] = useState(
    [...BUILDINGS].map((b) => ({ ...b, level: 0, progress: 0, upgrade: 0 })),
  )

  useInterval(() => {
    setMoney(money + getIncome(buildings))
    setBuildings(tickBuildings(buildings))
  }, INTERVAL)

  return (
    <Container>
      <Box maxWidth={300} mx="auto" display="flex" alignItems="center">
        <Typography>${numeral(money).format('0,0.00')}</Typography>
        <CustomButton label="$1" onClick={() => setMoney(money + 1)} />
      </Box>

      <Box display="flex" flexDirection="column">
        {buildings.map((building) => (
          <BuildingItem
            key={`building-${building.label}`}
            building={building}
            onClickLevel={() => {
              if (money >= getNextLevelCost(building)) {
                setMoney(money - getNextLevelCost(building))
                setBuildings(levelBuilding(buildings, building))
              }
            }}
            onClickUpgrade={() => {
              if (money >= getNextUpgradeCost(building)) {
                setMoney(money - getNextUpgradeCost(building))
                setBuildings(upgradeBuilding(buildings, building))
              }
            }}
          />
        ))}
      </Box>
    </Container>
  )
}

export default App
