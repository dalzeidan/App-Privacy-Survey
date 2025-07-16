import apple_labels from "./data/apple_labels.json";

export default function ComparisonScreen(results) {
    const valueMap = {
      0: 'Not collected',
      1: 'Used internally',
      2: 'Shared to 3rd party'
    };
    function formatResponses(responses, appleLabels) {
      const formattedResponses = Object.entries(responses).map(([field, uses]) => {
        const appleUse = appleLabels[field] || {};
        const purposeLines = Object.entries(uses).map(([purpose, value]) => {
          const textValue = valueMap[value];
          const appleValue = appleUse[purpose];
          const isDifferent = appleValue !== value;
             
          return (
              <div key={purpose} style={{
                  backgroundColor: isDifferent ? '#ffebee' : 'transparent',
              }}>
                  {`  ${purpose}: ${textValue}`}
              </div>
          );
          });

        return (
            <div key={field} style={{ marginBottom: '1em' }}>
                <div style={{ fontWeight: 'bold' }}>{field}:</div>
                {purposeLines}
            </div>
        );
      }); // seperates each data type with a new line
        
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
                    {formatResponses(results.results.responses, apple_labels.apple_labels)}
                </pre>
            </div>
            <div className="appleLabels">
                <h3 style={{ color: "black", textAlign: "center"}}>
                Apple's labels:
                </h3>
                <pre style={{textAlign: "left", whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>
                    {formatResponses(apple_labels.apple_labels, apple_labels.apple_labels)}
                </pre>
            </div>
        </div>
        </div>
      );
}