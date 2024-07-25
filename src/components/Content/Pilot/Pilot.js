import React, { useState, useEffect, useRef } from 'react';
import LbrTopics from '../LinkModules/LbrTopics.js';
import SliderInput from './PilotElements/SliderInput';
import ActualValue from '../Miscellaneous/ActualValue';
import './Pilot.scss';
import '../ComponentStylesMain.scss';

function Pilot({ ros, connectionStatus }) {
  const [jointValues, setJointValues] = useState(Array(7).fill(0));
  const [actualJointValues, setActualJointValues] = useState(Array(7).fill(0));
  const [lbrTopics, setLbrTopics] = useState(null);
  const jointNames = ['A1', 'A2', 'A4', 'A3', 'A5', 'A6', 'A7'];
  const initializedRef = useRef(false);

//Odbieranie wiadomości
  useEffect(() => {
    if (ros && connectionStatus === 'connected' && !initializedRef.current) {
      const newLbrTopics = new LbrTopics(ros);
      setLbrTopics(newLbrTopics);

      const initializeJointValues = (values) => {
        setJointValues(values);
        setActualJointValues(values);
        initializedRef.current = true;
      }
      //Deklaracja elmentów do komunikacji z rosem (klasa LbrTOpics)
      const unsubscribes = [
        newLbrTopics.subscribeToJointStates((values) => {
          if (!initializedRef.current) {
            initializeJointValues(values);
          } else {
            setActualJointValues(values);
          }
       })
        //tutaj wstawiaj dodatkowe elementy do komunikacji z ROSem
      ];

      return () => {
        unsubscribes.forEach(unsubscribe => {
          if (unsubscribe) unsubscribe();
        });
      };
    }
  }, [ros, connectionStatus]);




//Wysyłanie wartości
  const handleSliderChange = (index, newValue) => {
    const newJointValues = [...jointValues];
    newJointValues[index] = newValue;
    setJointValues(newJointValues);
  };
  //Prosty ruch przegubów 
  const publishJointValues = () => {
    if (lbrTopics) {
      console.log('Publishing joint values:', jointValues);
      lbrTopics.publishJointValues(jointNames, jointValues);
    } else {
      console.error('LbrTopics not initialized. Unable to publish joint values.');
    }
  };
  //Planowany ruch przegubów
  const publishMotionPlanRequest = () => {
    if (lbrTopics) {
      console.log('Planning and executing motion:', jointValues);
      lbrTopics.planAndExecuteMotion(jointNames, jointValues, actualJointValues)
    } else {
      console.error('LbrTopics not initialized. Unable to plan and execute motion.');
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
                  jointName={jointNames[index]}
                />
                <ActualValue value={actualJointValues[index]} />
              </div>
            ))}
            <button className="outputValue" onClick={publishJointValues}>Wyślij</button>
            <button className="outputValue" onClick={publishMotionPlanRequest}>Zaplanuj i wykonaj</button>
          </div>   
      ) : (
        <p>Brak połączenia z ROSem</p>
      )}
    </div>
  );
}

export default Pilot;