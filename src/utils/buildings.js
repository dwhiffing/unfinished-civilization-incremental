import { INTERVAL } from './constants'

export const getBuildingIncome = (building) =>
  building.level * building.income * (building.upgrade + 1)

export const getBuildingProgress = (building) =>
  1 - building.progress / (building.duration * 1000)

export const getBuildingFinished = (building) =>
  building.progress >= building.duration * 1000

export const getNextLevelCost = (building) =>
  Math.ceil(building.value * Math.pow(1.15, building.level))

export const getNextUpgradeCost = (building) =>
  Math.ceil(building.upCost * Math.pow(5, building.upgrade))

export const getIncome = (buildings) =>
  buildings.reduce(
    (sum, b) => sum + (getBuildingFinished(b) ? getBuildingIncome(b) : 0),
    0,
  )

export const tickBuildings = (buildings) =>
  buildings.map((b) => ({
    ...b,
    progress:
      b.level > 0
        ? getBuildingFinished(b)
          ? 0
          : b.progress + INTERVAL
        : b.progress,
  }))

export const levelBuilding = (buildings, building) =>
  buildings.map((b) => ({
    ...b,
    level: b.label === building.label ? b.level + 1 : b.level,
  }))

export const upgradeBuilding = (buildings, building) =>
  buildings.map((b) => ({
    ...b,
    upgrade: b.label === building.label ? b.upgrade + 1 : b.upgrade,
  }))
