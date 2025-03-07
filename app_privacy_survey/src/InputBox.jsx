import { useState } from "react";

export default function InputBox({index}) {
  const [level, setLevel] = useState(0);

  const handleClick = () => {
    let newLevel = level;
    if (newLevel == 2) {
      newLevel = -1;
    }
    setLevel(newLevel + 1);
  }

  const getColor = (level) => {
    if (level == 0) {
      return "green";
    } else if (level == 1) {
      return "yellow";
    } else if (level == 2) {
      return "red";
    }
    return "grey"
  }
  
  return (
    <div className={`input-box `} style={{backgroundColor:getColor(level)}} onClick={handleClick}>
      {index}
    </div>
  )
}