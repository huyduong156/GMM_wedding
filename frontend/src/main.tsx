import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { NavigationProvider } from './app/providers/navigation/NavigationProvider'
import './app/styles/index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavigationProvider>
      <App />
    </NavigationProvider>
  </React.StrictMode>,
)
