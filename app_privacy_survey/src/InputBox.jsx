import { useState, useContext, useEffect } from "react";
import { SurveyContext } from "./SurveyContext";

export default function InputBox({ typeName, purposeCategory, index }) {
  const { updateResponse, responses } = useContext(SurveyContext);
  
  // input box has the default state of being green (0)
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
    // select which color is gonna transition on click: 0 (green) -> 1 (orange) -> 2 (red) -> 0 (green)
    const newLevel = (level + 1) % 3;
    
    //local state value update
    setLevel(newLevel);
    
    // survey model value update
    updateResponse(typeName, purposeCategory, newLevel);
  };

  const getColor = (level) => {
    if (level === 0) {
      return "green";
    } else if (level === 1) {
      return "orange";
    } else if (level === 2) {
      return "red";
    }
    return "grey";
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