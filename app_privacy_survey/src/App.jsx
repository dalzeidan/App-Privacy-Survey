import { useContext, useState } from "react";
import "./App.css";
import InputRow from "./InputRow";
import { SurveyContext } from "./SurveyContext";
import exampleApp from "./assets/1exampleAppStore.jpeg";
import questionMark from "./assets/question-mark-outline.svg";

function App() {
  const { types, uses, getSurveyData, validateSurvey, exportData } =
    useContext(SurveyContext);
  const [surveyCompleted, setSurveyCompleted] = useState(false);
  const [surveyResults, setSurveyResults] = useState(null);
  const [popupText, setPopupText] = useState("");
  
  const handleSubmit = () => {
    if (validateSurvey()) {
      const results = exportData();
      setSurveyResults(results);
      setSurveyCompleted(true);
      console.log("Survey submitted:", results);

      // Send results directly to backend
      fetch("http://localhost:3000/api/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(results), // This will now be an object, not an array
      })
        .then((res) => {
          if (!res.ok) throw new Error("Failed to submit survey");
          return res.json();
        })
        .then((data) => {
          console.log("Successfully saved survey:", data);
        })
        .catch((err) => {
          console.error("Error submitting survey:", err);
        });
    } else {
      console.log("Survey validation failed");
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
          <h3 style={{ color: "black", textAlign: "center" }}>
            Thank you for your response
          </h3>
          {/* <h3>Your Responses:</h3>
          <pre>{JSON.stringify(surveyResults, null, 2)}</pre>
          <button onClick={() => setSurveyCompleted(false)}>Back to Survey</button> */}
        </div>
      </div>
    );
  }

  
  const showHelp = (description) => {
    setPopupText(description);
  };

  const hideHelp = () => {
    setPopupText("")
  }

  return (
    <div className="page survey-page">
      <div className="survey">
        <div className="purpose-headers">
          <div className="header-labels type-header">
            {popupText == "" ? (
              <>
                <div>Data Types</div>
                <div className="answer-legend">
                  <div className="answer-item">
                    <div className="color-box color-green"></div>
                    <span>Answer 1</span>
                  </div>
                  <div className="answer-item">
                    <div className="color-box color-orange"></div>
                    <span>Answer 2</span>
                  </div>
                  <div className="answer-item">
                    <div className="color-box color-red"></div>
                    <span>Answer 3</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="popup">{popupText}</div>
            )}
          </div>

          {uses.map((purpose) => (
            <div
              key={purpose.category + "header"}
              className="purpose-header"
              onMouseEnter={() => showHelp(purpose.description)}
              onMouseLeave={() => hideHelp()}
            >
              <div className="purpose-header-text-tilt">{purpose.category}</div>
              {/* <img src={questionMark} width={"20px"} height={"20px"} /> */}
            </div>
          ))}
        </div>
        {types.map((section) => {
          return (
            <div key={section.category} className="data-type-section">
              <h2>{section.category}</h2>
              {section.items.map((type) => (
                <div key={type.name} className="full-row row" onMouseEnter={() => showHelp(type.description)} onMouseLeave={() => hideHelp()}>
                  <div className="type-header" onMouseEnter={() => showHelp(type.description)} onMouseLeave={() => hideHelp()}>{type.name}</div>
                  <InputRow typeName={type.name} />
                </div>
              ))}
            </div>
          );
        })}

        <div
          className="survey-controls"
          style={{ margin: "20px 0", textAlign: "center" }}
        >
          <button onClick={handleSubmit}>Submit Survey</button>
        </div>
      </div>
      <div className="app-preview">
        <div className="app-preview-header">App Store Preview</div>

        <img src={exampleApp} width={"100%"} />
      </div>
    </div>
  );
}

export default App;
