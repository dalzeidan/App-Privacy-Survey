import { SurveyContextProvider } from "./SurveyContext";
import {BrowserRouter, Routes, Route} from "react-router"
import InnerApp from "./InnerApp";
import './index.css'

export default function App() {
  return (
    <SurveyContextProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<InnerApp />} />
      </Routes>
      </BrowserRouter>
    </SurveyContextProvider>
  );
}