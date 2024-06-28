import React from 'react';
import SliderInput from './PilotElements/SliderInput';
import ActualValue from '../Miscellaneous/ActualValue';
import './Pilot.scss';
import '../ComponentStylesMain.scss';



function Pilot({ ros, connectionStatus }) {
  const [jointValues, setJointValues] = useState(Array(7).fill(0));
  const jointNames = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'];

  return (
    <div className="pilot-content"> 
      <h1>Pilot</h1>
      {connectionStatus === 'connected' ? (
          <div className='sliders'> 
            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointNr = {0}
              />
              <ActualValue
                ros={ros}
                jointNr = {0}
              />
            </div>

           </div>
      ) : ( <p>Brak połączenia z ROSem</p> )}     
    </div>
  );
}



export default Pilot
