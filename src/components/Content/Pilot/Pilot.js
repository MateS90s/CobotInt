import React, { useState, useEffect } from 'react';
import LbrTopics from '../LinkModules/LbrTopics.js';
import SliderInput from './PilotElements/SliderInput';
import ActualValue from '../Miscellaneous/ActualValue';
import './Pilot.scss';
import '../ComponentStylesMain.scss';

function Pilot({ ros, connectionStatus }) {
  const [jointValues, setJointValues] = useState(Array(7).fill(0));
  const [actualJointValues, setActualJointValues] = useState(Array(7).fill(0));
  const [lbrTopics, setLbrTopics] = useState(null);
  const jointNames = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'];


//Odbieranie wiadomości
  useEffect(() => {
    if (ros && connectionStatus === 'connected') {
      const newLbrTopics = new LbrTopics(ros);
      setLbrTopics(newLbrTopics);

      const unsubscribe = newLbrTopics.subscribeToJointStates(setActualJointValues);
      
      return () => {
        if (unsubscribe) unsubscribe();
      };
    }
  }, [ros, connectionStatus]);


//Wysyłanie wartości
  const handleSliderChange = (index, newValue) => {
    const newJointValues = [...jointValues];
    newJointValues[index] = newValue;
    setJointValues(newJointValues);
  };

  const publishJointValues = () => {
    if (lbrTopics) {
      console.log('Publishing joint values:', jointValues);
      lbrTopics.publishJointValues(jointNames, jointValues);
    } else {
      console.error('LbrTopics not initialized. Unable to publish joint values.');
    }
  };
  
  return (
    <div className="pilot-content"> 
      <h1>Pilot</h1>
      {connectionStatus === 'connected' ? (
          <div className='sliders'> 
            {jointNames.map((jointName, index) => (
              <div key={jointName} className='slider-row'>
                <SliderInput
                  value={jointValues[index]}
                  onChange={(newValue) => handleSliderChange(index, newValue)}
                />
                <ActualValue value={actualJointValues[index]} />
              </div>
            ))}
            <button onClick={publishJointValues}>Wyślij</button>
          </div>
      ) : (
        <p>Brak połączenia z ROSem</p>
      )}
    </div>
  );
}

export default Pilot;