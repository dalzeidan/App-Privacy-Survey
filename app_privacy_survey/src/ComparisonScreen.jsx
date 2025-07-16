import { useContext, useState } from "react";
export default function ComparisonScreen(results) {
    function formatResponses(responses) {
        const valueMap = {
            0: 'Not collected',
            1: 'Used internally',
            2: 'Shared to 3rd party'
          };

        const formattedResponses = Object.entries(responses) // change to [key,value] pairs
          .map(([field, uses]) => {
            // 'field' is something like "Name" or "Email Address"
            // 'uses' is another object with categories like "Third-Party Advertising": 0, etc.

            // formats each use category as a line: "  Analytics: 0"
            const inner = Object.entries(uses)
              .map(([purpose, value]) => {
                const textValue = valueMap[value]; // maps the values 0,1,2 to their text answers
                return `  ${purpose}: ${textValue}`;
              }).join('\n'); // seperates each data use with a newline

            // combine data type with its data uses
            return `${field}:\n${inner}`;
          })
          .join('\n\n'); // seperates each data type with a new line
        
        return formattedResponses
      }

    return (
        <div className="page">
          <h2>Survey Completed</h2>
          <div>
            <h3 style={{ color: "black", textAlign: "center" }}>
              Thank you for your response!
            </h3>
            {/* <h3>Your Responses:</h3>
            <pre>{JSON.stringify(surveyResults, null, 2)}</pre>
            <button onClick={() => setSurveyCompleted(false)}>Back to Survey</button> */}
          </div>
        <div className="comparison">
            <div className="surveyResponses">
                <h3 style={{ color: "black", textAlign: "center"}}>
                Your responses:
                </h3>
                <pre style={{textAlign: "left", whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {formatResponses(results.results.responses)}
                </pre>
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