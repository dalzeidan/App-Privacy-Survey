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

  const [mouseDownState, setMouseDownState] = useState(false);

  const [start, setStart] = useState(null);

  const mouseDownListener = () => {
    setIsDragging(true);
    setMouseDownState(true);
  };

  const mouseUpListener = () => {
    setIsDragging(false);
    setMouseDownState(false);
  };

  useEffect(() => {
    window.addEventListener("mousedown", mouseDownListener);
    window.addEventListener("mouseup", mouseUpListener);

    return () => {
      window.removeEventListener("mousedown", mouseDownListener);
      window.removeEventListener("mouseup", mouseUpListener);
    };
  }, []);

  const isIncluded = (item) => {
    return selected.some(
      (selectedItem) =>
        selectedItem.typeName === item.typeName &&
        selectedItem.purposeCategory === item.purposeCategory // && selectedItem.setLevel === item.setLevel
    );
  };

  const addItem = (item) => {
    const exists = selected.some(
      (selectedItem) =>
        selectedItem.typeName === item.typeName &&
        selectedItem.purposeCategory === item.purposeCategory // && selectedItem.setLevel === item.setLevel
    );

    if (exists) {
      return;
    }

    const startAdded = selected.some(
      (selectedItem) =>
        selectedItem.typeName === start.typeName &&
        selectedItem.purposeCategory === start.purposeCategory // && selectedItem.setLevel === item.setLevel
    );



    let updated = [...selected, item];
    console.log("comp", item, start)
    if (!startAdded && !(item.typeName === start.typeName && item.purposeCategory === start.purposeCategory)) {
      console.log('faskdks')
      updated.push(start)
    }

    if (updated.length > 1) {
      setMulti(true);
    }

    console.log(updated)

    setSelected(updated)
  };

  const removeItem = (item) => {
    const filtered = selected.filter(
      (old) => !(old.typeName === item.typeName && old.purposeCategory === item.purposeCategory)
    );
    setSelected(filtered);
    if (filtered.length == 0) {
      setMulti(false);
    }
    return true;
  };

  const incrementAll = (level = -1) => {
    selected.forEach((item) => {
      let val = level;
      if (level == -1) {
        val = (responses[item.typeName][item.purposeCategory] + 1) % 3;
      }
      updateResponse(item.typeName, item.purposeCategory, val);
    });
  };

  const clearSelected = () => {
    setSelected([]);
    console.log(selected);
    setMulti(false);
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
        isIncluded,
        removeItem,
        multi,
        mouseDownState,
        setStart,
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

export function MultiControl() {
  const { incrementAll, selected, clearSelected, multi } = useContext(SelectContext);

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
      {multi ? (
        <div className="multi-control">
          <div className="text-center">{selected.length} Options selected</div>
          <div className="color-options">
            {Array.from({ length: 3 }, (_, i) => (
              <button
                key={i}
                className="color-options-input"
                onClick={() => incrementAll(i)}
                style={{ backgroundColor: getColor(i) }}
              >
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
