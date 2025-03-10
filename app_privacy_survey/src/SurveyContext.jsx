import { createContext, useState } from "react";
import data_types from "./data/data_types.json";
import data_use from "./data/data_use.json";

export const SurveyContext = createContext();

export function SurveyContextProvider({children}) {
  const types = data_types.data_types;
  const uses = data_use.data_use;

  
  let defaultResponse = [{
    dataType: "", // name of data type
    purposes: [], // purposes associated with dataType
    accessForPurpose: [], //array of user's access level choice to match purposes
    restrict:[] // array of arrays for restricted levels 
  }]

  let defaultResponses = [];

  function generateForm(dataType, purposes) {
    let startingResponses = [];

    dataType.forEach(element => {
      
    });
  }

  const [responses, setResponses] = useState(defaultResponses);
  return (
    <SurveyContext.Provider value={{types,uses, responses, setResponses}}>
      {children}
    </SurveyContext.Provider>
  )
}