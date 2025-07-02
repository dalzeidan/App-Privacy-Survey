import { createContext, useState, useEffect } from "react";
import data_types from "./data/data_types.json";
import data_use from "./data/data_use.json";
import { Model } from "survey-core";

export const SurveyContext = createContext();

export function SurveyContextProvider({ children }) {
  const types = data_types.data_types;
  const uses = data_use.data_use;

  // this is the SurveyJS model for responses
  const [surveyModel, setSurveyModel] = useState(null);
  const [responses, setResponses] = useState({});
  const [isValid, setIsValid] = useState(false);

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
    types.forEach((section) => {
      section.items.forEach((type) => {
        initialData[type.name] = {}; // name of data type

        setColorCycleCount((prev) => ({
          ...prev,
          [type.name]: 0, // sets the starting cycle count for a data type as 0
        }));

        // sets the initial survey state for each purpose
        uses.forEach((purpose) => {
          initialData[type.name][purpose.category] = -1;
        });
      });
    });

    // this is the initial state of the survey
    model.data = initialData;
    setSurveyModel(model);
    setResponses(initialData);

    setSurveyStartTime(new Date());

    // // event listener for changing an answer in the survey
    // model.onValueChanged.add((sender, options) => {
    //   console.log("Data changed:", options.name, options.value);
    //   console.log(sender)
    //   setResponses({...sender.data});
    // });
  }, [types, uses]);

  const trackColorCycle = (dataType, oldValue, newValue) => {
    // adds count everytime the survey participant cycles back to green for a data type
    if (newValue === 0 && oldValue !== 0) {
      setColorCycleCount((prev) => ({
        ...prev,
        [dataType]: (prev[dataType] || 0) + 1,
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
        [purpose]: value,
      };

      // Set the entire data object for this data type
      surveyModel.setValue(dataType, updatedTypeData);
    }

    let copy = responses;
    copy[dataType][purpose] = value;

    const updatedResponses = { ...copy };
    setResponses(updatedResponses);
    setIsValid(validateSurvey);
  };

  // gets current responses as a JSON
  const getSurveyData = () => {
    // return surveyModel ? surveyModel.data : {};
    return JSON.stringify(responses);
  };

  const validateSurvey = () => {
    // if (surveyModel) {
    //   return surveyModel.validate();
    // }

    const allValid = Object.entries(responses).every(([dataType, purposes]) => {
      let check = true;
      Object.values(purposes).every((purpose) => {
        if (purpose == -1) {
          console.log("Unanswered:", dataType, purpose);
          check = false;
        }
      });
      return check;
    });
    return allValid;
  };

  const exportData = () => {
    // if (!surveyModel) return null;

    const surveyTimeSeconds = surveyDuration || (surveyStartTime ? Math.round((new Date() - surveyStartTime) / 1000) : null); // calculate the time taken to complete the survey
    
    if (!surveyDuration && surveyStartTime) {
      setSurveyDuration(surveyTimeSeconds);
    }

    const totalCycles = Object.values(colorCycleCount).reduce((sum, count) => sum + count, 0); // total number of times a user cycles through answers

    const document = {
      // dcument object containing responses and stats
      responses: responses,
      metadata: {
        completionTimeSeconds: surveyTimeSeconds,
        colorCycles: { ...colorCycleCount },
        totalColorCycles: totalCycles,
      },
    };
    return document;
  };

  return (
    <SurveyContext.Provider
      value={{
        types,
        uses,
        responses,
        surveyModel,
        updateResponse,
        getSurveyData,
        validateSurvey,
        exportData,
        colorCycleCount,
      }}
    >
      {children}
    </SurveyContext.Provider>
  );
}
