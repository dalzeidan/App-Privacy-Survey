import { useState, useContext, useEffect, useRef } from "react";
import { SurveyContext } from "./SurveyContext";

export default function InputBox({ typeName, purposeCategory, index }) {
  const {
    updateResponse,
    responses,
    isDragging,
    setIsDragging,
    selected, registerDiv,updatingRef
  } = useContext(SurveyContext);

  const selfRef = useRef(null);

  
  // input box has the default state of being green (0)
  const [level, setLevel] = useState(-1);
  const [isHoldingDown, setIsHoldingDown] = useState(false);
  const isHoldingDownRef = useRef(isHoldingDown);

  useEffect(() => {
    isHoldingDownRef.current = isHoldingDown;
  }, [isHoldingDown]);

  // Update from survey data if available
  useEffect(() => {
    if (
      responses &&
      responses[typeName] &&
      responses[typeName][purposeCategory] !== undefined
    ) {
      const surveyValue = responses[typeName][purposeCategory];
      if (surveyValue !== -1) {
        setLevel(surveyValue);
      }
    }
  }, [responses, typeName, purposeCategory]);

  const handleClick = (e) => {
    if (isDragging && !updatingRef.current) {
      registerDiv(e);
    } else {
      const newLevel = (level + 1) % 3;
      
      //local state value update
      setLevel(newLevel);
      
      // survey model value update
      updateResponse(typeName, purposeCategory, newLevel);
    }
  };

  const handleMouseDown = (e) => {
    
    setIsHoldingDown(true);
    
    setTimeout(() => {
      console.log("You are")
      if (isHoldingDownRef.current) {
        setIsHoldingDown(false);
        console.log("is dragging")
        setIsDragging(true);
        // registerDiv(e)
      }
    }, 1000); // 1 second timeout

    
  };

  const handleMouseUp = () => {
    setIsHoldingDown(false);
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
  // console.log(selfRef)
  return (
    <div
      className="input-box"
      style={{ backgroundColor: getColor(level) }}
      onClick={handleClick}

      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      ref={selfRef}
    >
      {index}
      <div className={`select-box ${isDragging ? "absolute" : ""} `}>{selected.current.includes(selfRef) ? "☑" : isDragging ? "❎": ""}</div>
    </div>
  );
}