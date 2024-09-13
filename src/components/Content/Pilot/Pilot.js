import React, { useState, useEffect, useRef } from 'react';
import LbrTopics from '../LinkModules/LbrTopics';
import SliderInput from './PilotElements/SliderInput';
import ActualValue from '../Miscellaneous/ActualValue';
import RobotVisualization from './PilotElements/RobotVisualization';

function Pilot({ ros, connectionStatus }) {
  const [jointValues, setJointValues] = useState(Array(7).fill(0));
  const [actualJointValues, setActualJointValues] = useState(Array(7).fill(0));
  const [lbrTopics, setLbrTopics] = useState(null);
  const jointNames = ['A1', 'A2', 'A4', 'A3', 'A5', 'A6', 'A7'];
  const initializedRef = useRef(false);
  const [urdfContent, setUrdfContent] = useState('');

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

    // Wczytaj zawartość pliku URDF
    fetch(process.env.PUBLIC_URL + '/robot_description/sja.urdf')
    .then(response => response.text())
    .then(data => setUrdfContent(data));
    

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
      <div
        className={`flex flex-col space-y-4 ${
          connectionStatus !== 'connected' ? 'opacity-50 pointer-events-none' : ''
        }`}
      >
        <div className='flex justify-between'>
          <div className='flex flex-col space-y-4'>
              <div>
                <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Joint states</h1>
              </div>
            {jointNames.map((jointName, index) => (
              <div key={jointName} className='flex items-center space-x-4'>
                <SliderInput
                  value={jointValues[index]}
                  onChange={(newValue) => handleSliderChange(index, newValue)}
                  jointName={jointNames[index]}
                />
                <ActualValue value={actualJointValues[index]} />
              </div>
            ))}
          </div>
          <div className='flex-1 ml-8'>
            <h1 className="text-2xl font-semibold text-gray-800 mb-4 text-center">URDF Robot Visualization</h1>
            <RobotVisualization urdfContent={urdfContent} />
          </div>
        </div>
        <div className='flex justify-center space-x-4 mt-4'>
          <button
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={publishJointValues}
          >
            Send
          </button>
          <button
            className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={publishMotionPlanRequest}
          >
            Plan and execute
          </button>
        </div>
      </div>
      {connectionStatus !== 'connected' && (
        <p className="text-2xl text-red-500 animate-pulse">Brak połączenia z ROSem</p>
      )}
    </div>
  );
}

export default Pilot;
