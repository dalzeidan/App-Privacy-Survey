import { createContext, useState, useEffect, useRef } from "react";
import data_types from "./data/data_types.json";
import data_use from "./data/data_use.json";
import { Model } from "survey-core";

export const SurveyContext = createContext();

export function SurveyContextProvider({children}) {
  //Cursor Drag context
  const [isDragging, setIsDragging] = useState(false);
  const [updating, setUpdating] = useState(false);
  // const [selectedLevel, setselectedLevel] = useState()
  const selected = useRef([]);
  const updatingRef = useRef(updating);

  const registerDiv = (el) => {
    console.log(selected)
    if (el && !selected.current.includes(el.target)) {
      selected.current.push(el.target);
    } else if ( el && selected.current.includes(el.target)) {
      selected.current.filter((elm) => elm != el.target);
    }
  };

  const clickAllDivs = () => {
    setUpdating(false);
    console.log("clicking: ", selected)
    selected.current.forEach(div => {
      if (div) {
        console.log(div)
        div.click(); // or any other function you want to call
      }
    });
    setUpdating(true);
  };

  const types = data_types.data_types;
  const uses = data_use.data_use;
  
  // this is the SurveyJS model for responses
  const [surveyModel, setSurveyModel] = useState(null);
  const [responses, setResponses] = useState({});
  
  // Initialize SurveyJS model
  useEffect(() => {
    const model = new Model();
    
    // Configure survey settings
    model.showCompletedPage = false;
    model.showNavigationButtons = false;
    
    const initialData = {};

    // Create a structured data object for each type and purpose
    types.forEach(section => {
      section.items.forEach(type => {
        initialData[type.name] = {}; // name of data type

        // sets the initial survey states as 0 for each purpose
        uses.forEach(purpose => {
          initialData[type.name][purpose.category] = -1; // Each purpose gets a 0 value
        });
      });
    });
    
    // this is the initial state of the survey
    model.data = initialData;
    setSurveyModel(model);
    setResponses(initialData);
    
    // event listener for changing an answer in the survey
    model.onValueChanged.add((sender, options) => {
      console.log("Data changed:", options.name, options.value);
      setResponses({...sender.data});
    });
  }, [types, uses]);
  
// Updated updateResponse function to avoid using dot notation
const updateResponse = (dataType, purpose, value) => {
  if (surveyModel) {
    // Get the current data for this data type
    const currentTypeData = surveyModel.data[dataType] || {};
    
    // Update the specific purpose value
    const updatedTypeData = {
      ...currentTypeData,
      [purpose]: value
    };
    
    // Set the entire data object for this data type
    surveyModel.setValue(dataType, updatedTypeData);
    
    // Update local state
    const updatedResponses = {...responses};
    if (!updatedResponses[dataType]) {
      updatedResponses[dataType] = {};
    }
    updatedResponses[dataType][purpose] = value;
    setResponses(updatedResponses);
  }
};
  
  // gets current responses as a JSON
  const getSurveyData = () => {
    return surveyModel ? surveyModel.data : {};
  };
  
  const validateSurvey = () => {
    if (surveyModel) {
      return surveyModel.validate();
    }
    return false;
  };
  
  const exportData = () => {
    if (!surveyModel) return null;
  
    const document = {
      responses: {}
    };
  
    Object.entries(surveyModel.data).forEach(([dataType, purposes]) => {
      document.responses[dataType] = { ...purposes };
    });
  
    return document;
  };
  
  return (
    <SurveyContext.Provider value={{
      types,
      uses, 
      responses, 
      surveyModel,
      updateResponse,
      getSurveyData,
      validateSurvey,
      exportData,
      isDragging,setIsDragging,
      selected, registerDiv, clickAllDivs,updatingRef
    }}>
      {children}
    </SurveyContext.Provider>
  );
}