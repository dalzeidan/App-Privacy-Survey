import React, { useContext } from 'react';
import { SurveyContext } from './SurveyContext';
import InputBox from './InputBox';

export default function InputRow({ typeName }) {
  const { uses } = useContext(SurveyContext);

  return (
    <div className="input-row">
      {uses.map((purpose, index) => (
        <InputBox 
          key={`${typeName}-${purpose.category}-${index}`}
          typeName={typeName}
          purposeCategory={purpose.category}
          index={index}
        />
      ))}
    </div>
  );
}