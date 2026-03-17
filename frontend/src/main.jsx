import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import axios from 'axios'
import App from './App.jsx'

// Prefer explicit VITE_API_URL; otherwise use a safe default by environment.
if (import.meta.env.VITE_API_URL) {
    axios.defaults.baseURL = import.meta.env.VITE_API_URL;
} else if (import.meta.env.MODE === 'production') {
    axios.defaults.baseURL = 'https://backend-with-mongo.onrender.com';
} else {
    axios.defaults.baseURL = 'http://localhost:5000';
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
