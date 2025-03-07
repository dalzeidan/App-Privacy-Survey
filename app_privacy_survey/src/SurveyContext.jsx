import { createContext, useState } from "react";

export const SurveyContext = createContext();

export function SurveyContextProvider({children}) {

  const [dataTypes, setDataTypes] = useState(["Name", "Email address", "Phone number", "Physical address", "Other user contact info"]);
  const [purposes, setPurposeses] = useState(["Tracking", "Developer advertising", "Analytics", "Product personalization", "App functionality", "3rd party advertising", "Other purposes"]);
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

  defaultResponses = dataTypes.map((type,index) => {return {dataType: type, purposes:purposes, accessForPurpose: new Array(purposes.length)}})
  const [responses, setResponses] = useState(defaultResponses);
  return (
    <SurveyContext.Provider value={{dataTypes,purposes, responses, setResponses}}>
      {children}
    </SurveyContext.Provider>
  )
}