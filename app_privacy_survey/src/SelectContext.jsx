import {useState, createContext} from 'react'

export const SelectContext = createContext()

export function SelectContextProvider({children}) {
  const [isDragging, setIsDragging] = useState(false);
  const [selected, setSelected] = useState([]);
  return (
      <SelectContext.Provider value={{
        isDragging,
        setIsDragging,
        selected,
        setSelected
      }}>
        {children}
      </SelectContext.Provider>
    );
}
