import React, { useContext } from 'react'
import { SurveyContext } from './SurveyContext'
import InputBox from './InputBox';

export default function InputRow({index}) {
  const {uses} = useContext(SurveyContext);



  return (
    <div className="input-row">
      {uses.map((purpose, index) => <InputBox key={index+purpose} index={index}/>)}
    </div>
  )
}
