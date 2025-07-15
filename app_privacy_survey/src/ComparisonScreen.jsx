import { useContext, useState } from "react";
export default function ComparisonScreen() {
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
        <div className="comparison">
            <div className="surveyResponses">
                <h3 style={{ color: "black", textAlign: "center"}}>
                Your response:
                </h3>
            </div>
            <div className="appleLabels">
            <h3 style={{ color: "black", textAlign: "center"}}>
              Apple's labels:
            </h3>
            </div>
        </div>
        </div>
      );
}