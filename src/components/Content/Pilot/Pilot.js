import React, { useState, useEffect, useRef } from 'react';
import LbrTopics from '../LinkModules/LbrTopics.js';
import SliderInput from './PilotElements/SliderInput';
import ActualValue from '../Miscellaneous/ActualValue';

function Pilot({ ros, connectionStatus }) {
  const [jointValues, setJointValues] = useState(Array(7).fill(0));
  const [actualJointValues, setActualJointValues] = useState(Array(7).fill(0));
  const [lbrTopics, setLbrTopics] = useState(null);
  const jointNames = ['A1', 'A2', 'A4', 'A3', 'A5', 'A6', 'A7'];
  const initializedRef = useRef(false);

  // Odbieranie wiadomości
  useEffect(() => {
    if (ros && connectionStatus === 'connected' && !initializedRef.current) {
      const newLbrTopics = new LbrTopics(ros);
      setLbrTopics(newLbrTopics);

      const initializeJointValues = (values) => {
        setJointValues(values);
        setActualJointValues(values);
        initializedRef.current = true;
      }
      // Deklaracja elementów do komunikacji z ROSem
      const unsubscribes = [
        newLbrTopics.subscribeToJointStates((values) => {
          if (!initializedRef.current) {
            initializeJointValues(values);
          } else {
            setActualJointValues(values);
          }
        })
        // Tutaj wstawiaj dodatkowe elementy do komunikacji z ROSem
      ];

      return () => {
        unsubscribes.forEach(unsubscribe => {
          if (unsubscribe) unsubscribe();
        });
      };
    }
  }, [ros, connectionStatus]);

  // Wysyłanie wartości
  const handleSliderChange = (index, newValue) => {
    const newJointValues = [...jointValues];
    newJointValues[index] = newValue;
    setJointValues(newJointValues);
  };

  // Prosty ruch przegubów 
  const publishJointValues = () => {
    if (lbrTopics) {
      console.log('Publishing joint values:', jointValues);
      lbrTopics.publishJointValues(jointNames, jointValues);
    } else {
      console.error('LbrTopics not initialized. Unable to publish joint values.');
    }
  };

  // Planowany ruch przegubów
  const publishMotionPlanRequest = () => {
    if (lbrTopics) {
      console.log('Planning and executing motion:', jointValues);
      lbrTopics.planAndExecuteMotion(jointNames, jointValues, actualJointValues);
    } else {
      console.error('LbrTopics not initialized. Unable to plan and execute motion.');
    }
  };

  return (
    <div className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 p-6">
      <h1 className="text-3xl font-semibold text-gray-800">Pilot</h1>
      {connectionStatus === 'connected' ? (
        <div className='space-y-4'>
          {jointNames.map((jointName, index) => (
            <div key={jointName} className='flex items-center space-x-4 mb-2'>
              <SliderInput
                value={jointValues[index]}
                onChange={(newValue) => handleSliderChange(index, newValue)}
                jointName={jointNames[index]}
              />
              <ActualValue value={actualJointValues[index]} />
            </div>
          ))}
          <div className='space-x-2'>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={publishJointValues}
            >
              Send
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              onClick={publishMotionPlanRequest}
            >
              Plan and execute
            </button>
          </div>
        </div>
      ) : (
        <p className="text-red-500">Brak połączenia z ROSem</p>
      )}
    </div>
  );
}

export default Pilot;
