import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { AuthProvider } from './contexts/AuthContext'
import { AudioProvider } from './contexts/AudioContext'
import { UIProvider } from './contexts/UIContext'
import './index.css'
import './custom.css'

// Enable future flags
window.ROUTER_FUTURE = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter future={window.ROUTER_FUTURE}>
      <AuthProvider>
        <AudioProvider>
          <UIProvider>
            <App />
          </UIProvider>
        </AudioProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
) 