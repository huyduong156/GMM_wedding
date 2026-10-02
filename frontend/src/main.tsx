import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './app/App'
import { NavigationProvider } from './app/providers/navigation/NavigationProvider'
import { AuthProvider } from './features/auth/model/AuthProvider'
import './app/styles/index.css'
import './app/styles/fonts.css'

const app = (
  <NavigationProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </NavigationProvider>
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  import.meta.env.DEV ? <React.StrictMode>{app}</React.StrictMode> : app,
)
