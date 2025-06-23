import { useState, useContext, useEffect } from "react";
import { SurveyContext } from "./SurveyContext";
import { SelectContext } from "./SelectContext";
export default function InputBox({ typeName, purposeCategory, index }) {
  const { updateResponse, responses } = useContext(SurveyContext);
  const { setIsDragging, setSelected} = useContext(SelectContext)
  
  // input box has the default state of being green (0)
  const [level, setLevel] = useState(-1);

  const [holding, setHolding] = useState(false);
  const [holdTimeout, setHoldTimeout] = useState(null);
  
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
    // select which color is going to transition on click: 0 (green) -> 1 (orange) -> 2 (red) -> 0 (green)
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

  const handleMouseDown = (e) => {
    setHolding(true);
    
    setHoldTimeout(
      setTimeout(() => {
        console.log("holding")
        // console.log("You are")
        // if (isHoldingDownRef.current) {
        //   setIsHoldingDown(false);
        //   console.log("is dragging")
        //   setIsDragging(true);
        //   // registerDiv(e)
        // }
      }, 1000)
    ); // 1 second timeout
  }

  const handleMouseUp = (e) => {
    setHolding(false);
    clearTimeout(holdTimeout); 
  }
  
  return (
    <div 
      className="input-box" 
      style={{backgroundColor: getColor(level)}} 
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      
      {index}
    </div>
  );
}