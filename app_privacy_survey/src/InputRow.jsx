import React, { useContext } from 'react'
import { SurveyContext } from './SurveyContext'
import InputBox from './InputBox';

export default function InputRow({index}) {
  const {purposes} = useContext(SurveyContext);

  const updateResponse = (index) => {
    
  }

  return (
    <div className="input-row">
      {purposes.map((purpose, index) => <InputBox key={index+purpose} index={index}/>)}
    </div>
  )
}
