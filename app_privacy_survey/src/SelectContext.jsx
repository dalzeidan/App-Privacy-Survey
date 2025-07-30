import { useState, createContext, useRef, useContext, useEffect } from "react";
import { SurveyContext } from "./SurveyContext";

export const SelectContext = createContext();

export function SelectContextProvider({ children }) {
  const { updateResponse, responses } = useContext(SurveyContext);
  const [multi, setMulti] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState([]);
  // const [mouseDown, setMouseDown] = useState(false);

  // let selected = useRef([]);
  let mouseDown = useRef(false);

  const isIncluded = (item) => {
    return selected.some(
      (selectedItem) =>
        selectedItem.typeName === item.typeName &&
        selectedItem.purposeCategory === item.purposeCategory // && selectedItem.setLevel === item.setLevel
    );
  }

  const addItem = (item) => {
    const exists = selected.some(
      (selectedItem) =>
        selectedItem.typeName === item.typeName &&
        selectedItem.purposeCategory === item.purposeCategory // && selectedItem.setLevel === item.setLevel
    )

    if (!exists) {
      setSelected((prev) => [...prev, item]);
    }
    return false;
  };

  const incrementAll = (level = -1) => {
    selected.forEach((item) => {
      let val = level
      if (level == -1) {
        val = (responses[item.typeName][item.purposeCategory] + 1) % 3;
      }
      updateResponse(
        item.typeName,
        item.purposeCategory,
        val
      );
    });
  };

  const clearSelected = () => {
    setSelected([]);
    console.log(selected);
  };

  return (
    <SelectContext.Provider
      value={{
        isDragging,
        setIsDragging,
        selected,
        setSelected,
        addItem,
        incrementAll,
        mouseDown,
        clearSelected,
        isIncluded
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

export function MultiControl() {
  const { incrementAll, selected, clearSelected } = useContext(SelectContext);

  const [show, setShow] = useState(false);
  useEffect(() => {
    console.log("update");
    if (selected.length > 1) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [selected]);

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
    <>
      {show ? (
        <div className="multi-control">
          <div className="text-center">{selected.length} Options selected</div>
          <div className="color-options">
            {Array.from({ length: 3 }, (_, i) => (
              <button key={i} className="color-options-input" onClick={() => incrementAll(i)} style={{ backgroundColor: getColor(i) }}>
                {/* Option {i + 1} */}
              </button>
            ))}
          </div>
          {/* <button onClick={() => incrementAll()}>Increment</button> */}
          <button onClick={clearSelected}>Clear</button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
