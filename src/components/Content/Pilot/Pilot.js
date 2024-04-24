import React from 'react';
import SliderInput from './PilotElements/SliderInput';
import ActualValue from '../Miscellaneous/ActualValue';
import './Pilot.scss';
import '../ComponentStylesMain.scss';



function Pilot({ ros, connectionStatus }) {

  return (
    <div className="pilot-content"> 
      <h1>Pilot</h1>
      {connectionStatus === 'connected' ? (
          <div className='sliders'> 
            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointToChange = {0}
              />
              <ActualValue
                ros={ros}
                jointValue = {0}
              />
            </div>

            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointToChange = {1}
              />
              <ActualValue
                ros={ros}
                jointValue = {1}
              />
            </div>

            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointToChange = {2}
              />
              <ActualValue
                ros={ros}
                jointValue = {2}
              />
            </div>
            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointToChange = {3}
              />
              <ActualValue
                ros={ros}
                jointValue = {3}
              />
            </div>
            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointToChange = {4}
              />
              <ActualValue
                ros={ros}
                jointValue = {4}
              />
            </div>
            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointToChange = {5}
              />
              <ActualValue
                ros={ros}
                jointValue = {5}
              />
            </div>
            <div className='slider-row'> 
              <SliderInput 
                ros={ros}
                connectionStatus={connectionStatus}
                jointToChange = {6}
              />
              <ActualValue
                ros={ros}
                jointValue = {6}
              />
            </div>

           </div>
      ) : ( <p>Brak połączenia z ROSem</p> )}     
    </div>
  );
}



export default Pilot
