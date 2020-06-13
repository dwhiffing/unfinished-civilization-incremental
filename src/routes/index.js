import React from 'react'
import { Route, Switch } from 'react-router-dom'
import { CityRoute } from '../city/components/CityRoute'
import { ContinentRoute } from '../continent/components/ContinentRoute'
import { Planet } from './Planet'
import { System } from './System'
import { Galaxy } from './Galaxy'
import { useSelector } from 'react-redux'
import { getUnlocks } from '../selectors'

export const Routes = () => {
  const unlocks = useSelector(getUnlocks)

  return (
    <Switch>
      {unlocks.includes('system') && (
        <Route exact path="/system/:id" render={() => <System />} />
      )}
      {unlocks.includes('planet') && (
        <Route exact path="/planet/:id" render={() => <Planet />} />
      )}
      {unlocks.includes('continent') && (
        <Route exact path="/continent/:id" render={() => <ContinentRoute />} />
      )}
      <Route exact path="/city/:id" render={() => <CityRoute />} />
      <Route
        path="*"
        render={() => {
          if (unlocks.includes('galaxy')) return <Galaxy />
          if (unlocks.includes('system')) return <System />
          if (unlocks.includes('planet')) return <Planet />
          if (unlocks.includes('continent')) return <ContinentRoute />
          return <CityRoute />
        }}
      />
    </Switch>
  )
}
