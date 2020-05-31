import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './components/App'
import { Provider } from 'react-redux'
import store from './utils/store'

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render')
  whyDidYouRender(React)
}

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
)
