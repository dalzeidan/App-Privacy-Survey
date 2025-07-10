import { SurveyContextProvider } from "./SurveyContext";
import {BrowserRouter, Routes, Route} from "react-router"
import InnerApp from "./InnerApp";

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