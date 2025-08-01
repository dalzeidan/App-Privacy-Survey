import { SurveyContextProvider } from "./SurveyContext";
import {BrowserRouter, Routes, Route} from "react-router"
import InnerApp from "./InnerApp";
import './index.css'
import PracticeComponent from "./practiceComponent";
export default function App() {
  return (
    <SurveyContextProvider>
      <BrowserRouter>
      <Routes>
        <Route path="/" element={<PracticeComponent />} />
      </Routes>
      </BrowserRouter>
    </SurveyContextProvider>
  );
}