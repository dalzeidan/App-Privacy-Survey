import { useContext, useState } from "react";
import "./App.css";
import InputRow from "./InputRow";
import { SurveyContext } from "./SurveyContext";
import exampleApp from "./assets/1exampleAppStore.jpeg"

function App() {
  const { types, uses, getSurveyData, validateSurvey, exportData } = useContext(SurveyContext);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [surveyResults, setSurveyResults] = useState(null);

  const handleSubmit = () => {
    if (validateSurvey()) {
      const results = exportData();
      setSurveyResults(results);
      setSurveyCompleted(true);
      console.log("Survey submitted:", results);
      // TODO:
      // send the response object to the backend on submission
    } else {
      console.log("Survey validation failed");
      // Handle validation errors
    }
  };
  
  const handleLogData = () => {
    console.log("Current data:", getSurveyData());
  };

  // Show results if survey is completed
  if (surveyCompleted && surveyResults) {
    return (
      <div className="page">
        <h2>Survey Completed</h2>
        <div>
          <h3>Your Responses:</h3>
          <pre>{JSON.stringify(surveyResults, null, 2)}</pre>
          <button onClick={() => setSurveyCompleted(false)}>Back to Survey</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page survey-page">
      <div className="survey">
        <div className="purpose-headers">
          <div className="header-labels type-header"></div>
          {uses.map((purpose) => (
            <div key={purpose.category + "header"} className="purpose-header">
              <div className="purpose-header-text-tilt">{purpose.category}</div>
            </div>
          ))}
        </div>
        {types.map((section) => {
          return (
            <div key={section.category}>
              <h2>{section.category}</h2>
              {section.items.map((type) => (
                <div key={type.name} className="full-row row">
                  <div className="type-header">{type.name}</div>
                  <InputRow typeName={type.name} />
                </div>
              ))}
            </div>
          );
        })}
        
        <div className="survey-controls" style={{ margin: "20px 0", textAlign: "center" }}>
          <button onClick={handleSubmit}>Submit Survey</button>
        </div>
      </div>
      <div className="app-preview">
        <div className="app-preview-header">
          App store preview
          <button onClick={handleLogData}>
            Log Current Data
          </button>
        </div>
        
        <img src={exampleApp} width={"100%"}/>
      </div>
    </div>
  );
}

export default App;