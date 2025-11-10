import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './pages/App'
import Camera from './pages/Camera'
import Admin from './pages/Admin'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/g/:eventId" element={<Camera />} />
      <Route path="/admin/:eventId" element={<Admin />} />
    </Routes>
  </BrowserRouter>
)
