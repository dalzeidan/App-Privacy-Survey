import { useState, createContext } from "react";

export const SelectContext = createContext();

export function SelectContextProvider({ children }) {
  const [multi, setMulti] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState([]);

  const addItem = (item) => {
    const exists = selected.some(
      (selectedItem) =>
        selectedItem.typeName === item.typeName &&
        selectedItem.purposeCategory === item.purposeCategory // && selectedItem.setLevel === item.setLevel
    );

    if (!exists) {
      setSelected((prev) => [...prev, item]);
    }
  };

  const incrementAll = () => {
    selected.forEach((item) => {
      // console.log(item)
      item.handleClick();
    });
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
      }}
    >
      {children}
    </SelectContext.Provider>
  );
}
