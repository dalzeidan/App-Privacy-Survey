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
  
  const [surveyStartTime, setSurveyStartTime] = useState(null);
  const [surveyDuration, setSurveyDuration] = useState(null);
  const [colorCycleCount, setColorCycleCount] = useState({});
  
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
        
        setColorCycleCount(prev => ({
          ...prev,
          [type.name]: 0 // sets the starting cycle count for a data type as 0
        }));

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
    
    setSurveyStartTime(new Date());
    
    // event listener for changing an answer in the survey
    model.onValueChanged.add((sender, options) => {
      console.log("Data changed:", options.name);
      // console.log("Data changed:", options.name, options.value);
      setResponses({...sender.data});
    });
  }, [types, uses]);
  
  const trackColorCycle = (dataType, oldValue, newValue) => { // adds count everytime the survey participant cycles back to green for a data type
    if (newValue === 0 && oldValue !== 0) {
      setColorCycleCount(prev => ({
        ...prev,
        [dataType]: (prev[dataType] || 0) + 1
      }));
    }
  };

  // Updated updateResponse function to avoid using dot notation
  const updateResponse = (dataType, purpose, value) => {
    if (surveyModel) {
      // Get the current data for this data type
      const currentTypeData = surveyModel.data[dataType] || {};
      
      const currentValue = currentTypeData[purpose];
      
      trackColorCycle(dataType, currentValue, value);
      
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
  
    const surveyTimeSeconds = surveyDuration || 
      (surveyStartTime ? Math.round((new Date() - surveyStartTime) / 1000) : null); // calculate the time taken to complete the survey
    
    const totalCycles = Object.values(colorCycleCount).reduce((sum, count) => sum + count, 0); // total number of times a user cycles through answers
  
    const document = { // dcument object containing responses and stats
      responses: {},
      metadata: {
        completionTimeSeconds: surveyTimeSeconds,
        colorCycles: {...colorCycleCount},
        totalColorCycles: totalCycles
      }
    };
  
    // build object for survey responses
    Object.entries(surveyModel.data).forEach(([dataType, purposes]) => {
      document.responses[dataType] = { ...purposes };
    });
    
    if (!surveyDuration && surveyStartTime) {
      setSurveyDuration(surveyTimeSeconds);
    }
  
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
      colorCycleCount
    }}>
      {children}
    </SurveyContext.Provider>
  );
}