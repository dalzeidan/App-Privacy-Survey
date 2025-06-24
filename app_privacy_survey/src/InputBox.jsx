import { useState, useContext, useEffect, useRef } from "react";
import { SurveyContext } from "./SurveyContext";
import { SelectContext } from "./SelectContext";
export default function InputBox({ typeName, purposeCategory, index }) {
  const { updateResponse, responses } = useContext(SurveyContext);
  const { isDragging, setIsDragging, addItem } = useContext(SelectContext);

  // input box has the default state of being green (0)
  const [level, setLevel] = useState(-1);

  // const [holding, setHolding] = useState(false);
  const holdTimeout = useRef(null);

  // Update from survey data if available
  useEffect(() => {
    if (responses && responses[typeName] && responses[typeName][purposeCategory] !== undefined) {
      const surveyValue = responses[typeName][purposeCategory];
      if (surveyValue !== -1) {
        setLevel(surveyValue);
      }
    }
  }, [responses, typeName, purposeCategory]);

  const handleClick = () => {
    console.log("click")
    console.log(level)
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
    // setHolding(true);

    holdTimeout.current = setTimeout(() => {
      console.log("Now dragging");
      setIsDragging(true);
      // setSelected((prev) => [...prev, {typeName, purposeCategory, setLevel}])
      addItem({ typeName, purposeCategory, handleClick });
      // console.log("You are")
      // if (isHoldingDownRef.current) {
      //   setIsHoldingDown(false);
      //   console.log("is dragging")
      //   setIsDragging(true);
      //   // registerDiv(e)
      // }
    }, 1000); // 1 second timeout
  };

  const handleMouseUp = () => {
    console.log("mouse up");
    clearTimeout(holdTimeout.current);
    setIsDragging(false);
    // setHolding(false);
  };

  const handleMouseEnter = () => {
    if (isDragging) {
      addItem({ typeName, purposeCategory, handleClick });
    }
  }

  return (
    <div
      className="input-box"
      style={{ backgroundColor: getColor(level) }}
      onClick={handleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
    >
      {index}
    </div>
  );
}
