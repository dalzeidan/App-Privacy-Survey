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

  const addItem = (item) => {
    const exists = selected.some(
      (selectedItem) =>
        selectedItem.typeName === item.typeName &&
        selectedItem.purposeCategory === item.purposeCategory // && selectedItem.setLevel === item.setLevel
    );

    if (!exists) {
      setSelected((prev) => [...prev, item]);
    }
    return false;
  };

  const incrementAll = () => {
    selected.forEach((item) => {
      // console.log(item)
      // item.handleClick();
      updateResponse(item.typeName, item.purposeCategory, (responses[item.typeName][item.purposeCategory]  + 1) % 3)
    });
  };

  const clearSelected = () => {
    setSelected([]);
    console.log(selected)
  }

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
        clearSelected
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}

export function MultiControl() {
  const { incrementAll, selected,clearSelected } = useContext(SelectContext);

  const [show, setShow] = useState(false);
  useEffect(()=> {
    console.log("update")
    if (selected.length > 1) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [selected])

  return (
    <>
      {show ? (
        <div className="multi-control">
          <div>
            {selected.length} Options selected
          </div>
          <button onClick={incrementAll}>Increment</button>
          <button onClick={clearSelected}>Clear</button>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
