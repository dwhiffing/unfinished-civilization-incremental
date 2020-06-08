export const SYSTEM_COUNT_RANGE = [3, 3]
export const PLANET_COUNT_RANGE = [2, 5]
export const CONTINENT_COUNT_RANGE = [2, 4]
export const PLOT_COUNT_RANGE = [2, 6]
export const RESOURCE_MULTIPLIER = 50

export const buyables = [
  {
    id: 'createBuilding',
    label: '+ building',
    cost: { wood: 10 },
  },
  {
    id: 'buyCity',
    label: '+ city',
    cost: { wood: 100 },
  },
  {
    id: 'buySeat',
    label: '+ seat',
    cost: { wood: 10 },
  },
  {
    id: 'buyPerson',
    label: '+ person',
    cost: { food: 5 },
  },
  {
    id: 'exploreGalaxy',
    label: 'explore systems',
    cost: { wood: 10 },
  },
  {
    id: 'exploreSystem',
    label: 'explore stars',
    cost: { wood: 10 },
  },
  {
    id: 'explorePlanet',
    label: 'explore ocean',
    cost: { wood: 10 },
  },
  {
    id: 'exploreContinent',
    label: 'explore',
    cost: { wood: 10 },
  },
  {
    id: 'settleSystem',
    label: 'settle system',
    cost: { wood: 10 },
  },
  {
    id: 'settlePlanet',
    label: 'settle planet',
    cost: { wood: 10 },
  },
  {
    id: 'settleContinent',
    label: 'settle continent',
    cost: { wood: 10 },
  },
]

export const buildingTypes = [
  {
    id: 'center',
    label: 'City Center',
    tasks: [{ id: 'scavenge' }, { id: 'chop' }],
  },
  { id: 'barracks', label: 'Encampment', tasks: [{ id: 'hunt' }] },
  { id: 'industry', label: 'Industrial Zone', tasks: [{ id: 'mine' }] },
  { id: 'church', label: 'Holy Site', tasks: [{ id: 'pray' }] },
  { id: 'campus', label: 'Campus', tasks: [{ id: 'study' }] },
  { id: 'market', label: 'Commercial Hub', tasks: [{ id: 'trade' }] },
  { id: 'theatre', label: 'Theatre Square', tasks: [{ id: 'perform' }] },
]

export const resources = [
  { id: 'food' },
  { id: 'wood' },
  { id: 'faith' },
  { id: 'stone' },
  { id: 'fur' },
  { id: 'gold' },
  { id: 'culture' },
  { id: 'science' },
]

export const tasks = [
  { id: 'chop', duration: 1, effect: { id: 'wood', value: 1 } },
  { id: 'scavenge', duration: 1, effect: { id: 'food', value: 1 } },
  { id: 'mine', duration: 1, effect: { id: 'stone', value: 1 } },
  { id: 'pray', duration: 1, effect: { id: 'faith', value: 1 } },
  { id: 'hunt', duration: 1, effect: { id: 'fur', value: 1 } },
  { id: 'trade', duration: 1, effect: { id: 'gold', value: 1 } },
  { id: 'perform', duration: 1, effect: { id: 'culture', value: 1 } },
  { id: 'study', duration: 1, effect: { id: 'science', value: 1 } },
]
