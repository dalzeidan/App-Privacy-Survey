import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {BrowserRouter, Routes, Route} from "react-router"
import './index.css'
import App from './App.jsx'
import { SurveyContextProvider } from './SurveyContext.jsx'


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SurveyContextProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
      </Routes>
      </BrowserRouter>
    </SurveyContextProvider>
  </StrictMode>,
)
