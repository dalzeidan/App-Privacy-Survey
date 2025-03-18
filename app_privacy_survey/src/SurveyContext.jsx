import { createContext, useState, useEffect } from "react";
import data_types from "./data/data_types.json";
import data_use from "./data/data_use.json";
import { Model } from "survey-core";

export const SurveyContext = createContext();

export function SurveyContextProvider({children}) {
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
        
        // sets the initial survey states as green (0)
        uses.forEach(purpose => {
          initialData[type.name][purpose.category] = 0;
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
  
  // updates a response value
  const updateResponse = (dataType, purpose, value) => {
    if (surveyModel) {
      // survey JS model state update
      surveyModel.setValue(`${dataType}.${purpose}`, value);
      
      // local state update
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
  
  //exports data in a specific format if needed
  const exportData = () => {
    if (!surveyModel) return null;
    
    const result = [];
    
    Object.entries(surveyModel.data).forEach(([dataType, purposes]) => {
      const dataTypeEntry = {
        dataType: dataType,
        purposes: [],
        accessForPurpose: [],
        restrict: []
      };
      
      // adds all responses to the response object
      Object.entries(purposes).forEach(([purpose, level]) => {
        dataTypeEntry.purposes.push(purpose);
        dataTypeEntry.accessForPurpose.push(level);
        dataTypeEntry.restrict.push([]);
      });
      
      result.push(dataTypeEntry);
    });
    
    return result;
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
      exportData
    }}>
      {children}
    </SurveyContext.Provider>
  );
}