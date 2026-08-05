import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { NavigationProvider } from './app/providers/navigation/NavigationProvider'
import { AuthProvider } from './features/auth/model/AuthProvider'
import './app/styles/index.css'
import './app/styles/fonts.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <NavigationProvider>
      <AuthProvider><App /></AuthProvider>
    </NavigationProvider>
  </React.StrictMode>,
)
