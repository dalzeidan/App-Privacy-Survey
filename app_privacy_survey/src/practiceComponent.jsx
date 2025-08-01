import React, { useState, useContext } from 'react';
import { SurveyContext } from './SurveyContext';

const PracticeBox = ({ index, onColorChange, resetTrigger, rowName, colName }) => {
  const [level, setLevel] = useState(-1); // -1 = grey, 0 = green, 1 = orange, 2 = red
  
  // Reset when resetTrigger changes
  React.useEffect(() => {
    setLevel(-1);
  }, [resetTrigger]);

  const handleClick = () => {
    const newLevel = (level + 1) % 3;
    setLevel(newLevel);
    onColorChange(index, newLevel);
  };

  const getColor = (level) => {
    if (level === 0) return "green";
    if (level === 1) return "orange";
    if (level === 2) return "red";
    return "grey";
  };

  return (
    <div 
      className="input-box" 
      style={{
        backgroundColor: getColor(level),
        width: '70px',
        height: '70px',
        border: 'none',
        borderRadius: '4px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontWeight: '600',
        color: 'white',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        margin: '3px 6px 3px 0',
        fontSize: '12px'
      }}
      onClick={handleClick}
    >
      {index + 1}
    </div>
  );
};

export default function PracticeComponent({ onComplete }) {
  const { uses } = useContext(SurveyContext);
  const [step, setStep] = useState(1);
  const [boxColors, setBoxColors] = useState([-1, -1, -1]);
  const [resetTrigger, setResetTrigger] = useState(0);

  // Use first 3 purposes from the actual survey data
  const practiceUses = uses ? uses.slice(0, 3) : [
    { category: "Analytics"},
    { category: "App Functionality"},
    { category: "Advertising"}
  ];

  const handleColorChange = (index, color) => {
    const newColors = [...boxColors];
    newColors[index] = color;
    setBoxColors(newColors);
  };

  const checkStep1Complete = () => {
    return boxColors.every(color => color === 0); // All "Not collected"
  };

  const checkStep2Complete = () => {
    const uniqueColors = new Set(boxColors.filter(color => color !== -1));
    return uniqueColors.size === 3 && boxColors.every(color => color !== -1);
  };

  const handleNextStep = () => {
    if (step === 1 && checkStep1Complete()) {
      setStep(2);
      // Reset boxes for step 2
      setBoxColors([-1, -1, -1]);
      setResetTrigger(prev => prev + 1);
    } else if (step === 2 && checkStep2Complete()) {
      setStep(3);
    }
  };

  const handleStartSurvey = () => {
    onComplete();
  };

  const resetPractice = () => {
    setStep(1);
    setBoxColors([-1, -1, -1]);
    setResetTrigger(prev => prev + 1);
  };

  const getColorText = (level) => {
    if (level === 0) return "Not collected";
    if (level === 1) return "Used internally";
    if (level === 2) return "Shared to 3rd party";
    return "Not selected";
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      backgroundColor: '#f0f0f0',
      padding: '20px',
      fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '40px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        maxWidth: '800px',
        textAlign: 'center'
      }}>
        <h1 style={{ color: '#4a6fa5', marginBottom: '30px' }}>
          Practice Session
        </h1>
        
        {step === 1 && (
          <>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>
              Step 1: Set all data as "Not collected"
            </h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Click each box until it shows "Not collected" (green). This represents data that the app doesn't collect at all.
            </p>
          </>
        )}

        {step === 2 && (
          <>
            <h2 style={{ color: '#333', marginBottom: '20px' }}>
              Step 2: Set different data collection levels
            </h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              Now set each box to a different level: "Not collected", "Used internally", and "Shared to 3rd party".
            </p>
          </>
        )}

        {step === 3 && (
          <>
            <h2 style={{ color: '#28a745', marginBottom: '20px' }}>
              Perfect! You're ready for the survey!
            </h2>
            <p style={{ color: '#666', marginBottom: '30px' }}>
              You understand how to indicate different data collection levels. In the real survey, you'll see many more data types and purposes.
            </p>
          </>
        )}

        {/* Survey-like layout */}
        <div style={{
          border: '1px solid #ddd',
          borderRadius: '8px',
          overflow: 'hidden',
          marginBottom: '30px',
          backgroundColor: 'white'
        }}>
          {/* Header row */}
          <div style={{
            display: 'flex',
            backgroundColor: '#fff',
            borderBottom: '2px solid #ddd',
            height: '180px',
            alignItems: 'center'
          }}>
            <div style={{
              width: '200px',
              padding: '15px',
              fontWeight: '600',
              borderRight: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center',
              backgroundColor: '#eef2f7',
              height: '100%'
            }}>
              <div>
                <div>Data Collection</div>
                <div style={{ fontSize: '12px', marginTop: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <div style={{ width: '15px', height: '15px', backgroundColor: 'green', borderRadius: '3px' }}></div>
                    <span>Not collected</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '5px' }}>
                    <div style={{ width: '15px', height: '15px', backgroundColor: 'orange', borderRadius: '3px' }}></div>
                    <span>Used internally</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '15px', height: '15px', backgroundColor: 'red', borderRadius: '3px' }}></div>
                    <span>Shared to 3rd party</span>
                  </div>
                </div>
              </div>
            </div>
            {practiceUses.map((purpose, index) => (
              <div key={purpose.category} style={{
                width: '75px',
                height: '180px',
                flexShrink: 0,
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  width: '160px',
                  textAlign: 'left',
                  transformOrigin: 'bottom left',
                  transform: 'rotate(-45deg)',
                  bottom: '20px',
                  left: '35px',
                  fontWeight: '500',
                  color: '#000000',
                  whiteSpace: 'nowrap',
                  fontSize: '11px'
                }}>
                  {purpose.category}
                </div>
              </div>
            ))}
          </div>
          
          {/* Data row */}
          <div style={{
            display: 'flex',
            backgroundColor: 'white'
          }}>
            <div style={{
              width: '200px',
              padding: '15px',
              fontWeight: '600',
              borderRight: '1px solid #ddd',
              display: 'flex',
              alignItems: 'center'
            }}>
              Name
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              padding: '5px'
            }}>
              {[0, 1, 2].map(index => (
                <PracticeBox
                  key={index}
                  index={index}
                  onColorChange={handleColorChange}
                  resetTrigger={resetTrigger}
                  rowName="Name"
                  colName={practiceUses[index]?.category}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Status display */}
        <div style={{ marginBottom: '20px', fontSize: '14px' }}>
          {step === 1 && (
            <div style={{ color: checkStep1Complete() ? '#28a745' : '#666' }}>
              {checkStep1Complete() ? '✓ Perfect! All data is set to "Not collected".' : 'Click boxes to set them all to "Not collected" (green).'}
            </div>
          )}
          
          {step === 2 && (
            <div style={{ color: checkStep2Complete() ? '#28a745' : '#666' }}>
              {checkStep2Complete() ? '✓ Excellent! Each box has a different data collection level.' : 'Set each box to a different collection level.'}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          {step < 3 && (
            <button
              onClick={handleNextStep}
              disabled={step === 1 ? !checkStep1Complete() : !checkStep2Complete()}
              style={{
                backgroundColor: (step === 1 ? checkStep1Complete() : checkStep2Complete()) ? '#4a6fa5' : '#ccc',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: (step === 1 ? checkStep1Complete() : checkStep2Complete()) ? 'pointer' : 'not-allowed',
                fontSize: '16px',
                transition: 'all 0.2s ease'
              }}
            >
              {step === 1 ? 'Next Step' : 'Complete Practice'}
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleStartSurvey}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: '600',
                transition: 'all 0.2s ease'
              }}
            >
              Start Survey
            </button>
          )}

          <button
            onClick={resetPractice}
            style={{
              backgroundColor: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'all 0.2s ease'
            }}
          >
            Reset Practice
          </button>
        </div>
      </div>
    </div>
  );
}