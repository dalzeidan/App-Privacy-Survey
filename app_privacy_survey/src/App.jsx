import { SurveyContextProvider } from "./SurveyContext";
import { BrowserRouter, Routes, Route } from "react-router";
import InnerApp from "./InnerApp";
import "./index.css";
import { SelectContextProvider } from "./SelectContext";

export default function App() {
  return (
    <SurveyContextProvider>
      <SelectContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<InnerApp />} />
          </Routes>
        </BrowserRouter>
      </SelectContextProvider>
    </SurveyContextProvider>
  );
}
