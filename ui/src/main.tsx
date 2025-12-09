import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Books from './Books.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <Books />
  </StrictMode>,
)
