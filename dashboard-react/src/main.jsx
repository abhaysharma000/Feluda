import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { UIProvider } from './context/UIContext'
import './index.css'
import App from './App.jsx'


console.log("FELUDA_BOOT: Initializing Neural Dashboard...");
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UIProvider>
      <BrowserRouter basename="/dashboard">
        <App />
      </BrowserRouter>
    </UIProvider>
  </StrictMode>,
)
