import React from 'react';
import SliderInput from './PilotElements/SliterInput';
import ActualValue from '../Miscellaneous/ActualValue';
import './Pilot.scss';
import '../ComponentStylesMain.scss';



function Pilot({ ros, connectionStatus }) {

  return (
    <div className="pilot-content"> 
      <h1>Pilot</h1>
      {connectionStatus === 'connected' ? (
        <div style={{ display: 'flex', alignItems: 'center'}}>
          <SliderInput 
          ros={ros}
          connectionStatus={connectionStatus}
          />
          <ActualValue
          ros={ros}
          />
        </div>
      ) : ( <p>Brak połączenia z ROSem</p> )}     
    </div>
  );
}



export default Pilot
