import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CityRoute } from './city/components/CityRoute'
import { ContinentRoute } from './continent/components/ContinentRoute'
import { PlanetRoute } from './planet/components/PlanetRoute'
import { SystemRoute } from './system/components/SystemRoute'
import { Galaxy } from './shared/components/Galaxy'
import { useSelector } from 'react-redux'
import { getUnlocks } from './shared/selectors'

export const Routes = () => {
  const unlocks = useSelector(getUnlocks)

  return (
    <Switch>
      {unlocks.includes('system') && (
        <Route exact path="/system/:id" render={() => <SystemRoute />} />
      )}
      {unlocks.includes('planet') && (
        <Route exact path="/planet/:id" render={() => <PlanetRoute />} />
      )}
      {unlocks.includes('continent') && (
        <Route exact path="/continent/:id" render={() => <ContinentRoute />} />
      )}
      <Route exact path="/city/:id" render={() => <CityRoute />} />
      <Route
        path="*"
        render={() => {
          if (unlocks.includes('galaxy')) return <Galaxy />
          if (unlocks.includes('system')) return <SystemRoute />
          if (unlocks.includes('planet')) return <PlanetRoute />
          if (unlocks.includes('continent')) return <ContinentRoute />
          return <CityRoute />
        }}
      />
    </Switch>
  )
}
