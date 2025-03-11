import { useState, useContext, useEffect } from "react";
import { SurveyContext } from "./SurveyContext";

export default function InputBox({ typeName, purposeCategory, index }) {
  const { updateResponse, responses } = useContext(SurveyContext);
  
  // Initialize with a default state (green)
  const [level, setLevel] = useState(0);
  
  // Update from survey data if available
  useEffect(() => {
    if (responses && responses[typeName] && 
        responses[typeName][purposeCategory] !== undefined) {
      const surveyValue = responses[typeName][purposeCategory];
      if (surveyValue !== -1) {
        setLevel(surveyValue);
      }
    }
  }, [responses, typeName, purposeCategory]);

  const handleClick = () => {
    // Cycle through levels: 0 (green) -> 1 (orange) -> 2 (red) -> 0 (green)
    const newLevel = (level + 1) % 3;
    
    // Update local state
    setLevel(newLevel);
    
    // Update the survey model
    updateResponse(typeName, purposeCategory, newLevel);
  };

  const getColor = (level) => {
    if (level === 0) {
      return "green"; // Green
    } else if (level === 1) {
      return "orange"; // Orange
    } else if (level === 2) {
      return "red"; // Red
    }
    return "grey"; // Default
  };
  
  return (
    <div 
      className="input-box" 
      style={{backgroundColor: getColor(level)}} 
      onClick={handleClick}
    >
      {index}
    </div>
  );
}