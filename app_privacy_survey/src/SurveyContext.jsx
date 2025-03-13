import { createContext, useState, useEffect } from "react";
import data_types from "./data/data_types.json";
import data_use from "./data/data_use.json";
import { Model } from "survey-core";

export const SurveyContext = createContext();

export function SurveyContextProvider({children}) {
  const types = data_types.data_types;
  const uses = data_use.data_use;
  
  // Create a SurveyJS model to handle responses
  const [surveyModel, setSurveyModel] = useState(null);
  const [responses, setResponses] = useState({});
  
  // Initialize SurveyJS model
  useEffect(() => {
    // Create an empty survey model
    const model = new Model();
    
    // Configure survey settings
    model.showCompletedPage = false;
    model.showNavigationButtons = false;
    
    // Initialize the data structure in the model
    const initialData = {};
    
    // Create a structured data object for each type and purpose
    types.forEach(section => {
      section.items.forEach(type => {
        // Create an entry for each data type
        initialData[type.name] = {};
        
        // Add entries for each purpose with default value 0 (green)
        uses.forEach(purpose => {
          initialData[type.name][purpose.category] = 0; // Initialize all to green (0)
        });
      });
    });
    
    // Set the initial data
    model.data = initialData;
    setSurveyModel(model);
    setResponses(initialData);
    
    // Add event listener for changes
    model.onValueChanged.add((sender, options) => {
      console.log("Data changed:", options.name, options.value);
      setResponses({...sender.data});
    });
  }, [types, uses]);
  
  // Function to update a specific response value
  const updateResponse = (dataType, purpose, value) => {
    if (surveyModel) {
      // Update the value in the SurveyJS model
      surveyModel.setValue(`${dataType}.${purpose}`, value); // Unclear if correct way to update model
      
      // Also update our local state (for immediate UI updates)
      const updatedResponses = {...responses};
      if (!updatedResponses[dataType]) {
        updatedResponses[dataType] = {};
      }
      updatedResponses[dataType][purpose] = value;
      setResponses(updatedResponses);
    }
  };
  
  // Function to get the current data as JSON
  const getSurveyData = () => {
    return surveyModel ? surveyModel.data : {};
  };
  
  // Function to validate the entire survey
  const validateSurvey = () => {
    if (surveyModel) {
      return surveyModel.validate();
    }
    return false;
  };
  
  // Function to export data in a specific format if needed
  const exportData = () => {
    if (!surveyModel) return null;
    
    // Transform the data into your desired output format
    const result = [];
    
    Object.entries(surveyModel.data).forEach(([dataType, purposes]) => {
      const dataTypeEntry = {
        dataType: dataType,
        purposes: [],
        accessForPurpose: [],
        restrict: []
      };
      
      Object.entries(purposes).forEach(([purpose, level]) => {
        // Include all values - we can filter if needed
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