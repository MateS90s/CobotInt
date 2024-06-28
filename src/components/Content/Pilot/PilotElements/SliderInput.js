import React, { useState, useEffect} from 'react';
import ROSLIB from 'roslib';
import './SliderInput.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight  } from '@fortawesome/free-solid-svg-icons';

function SliderInput ({ros, connectionStatus, jointNr}) {
    const [sliderValue, setSliderValue] = useState(0);
    const [buttonClicked, setButtonClicked] = useState(false);

// Sider - obsługa 2
const handleSliderChange = (event) => {
    const newValue = parseFloat(event.target.value)
    setSliderValue(newValue);
}

 useEffect(() => {
    if (!ros) return;

    // Tworzenie obiektu publishera do nadawania wiadomości 
    const my_topic_publisher = new ROSLIB.Topic({
        ros,
        name: '/lbr/joint_trajectory_controller/joint_trajectory',
        messageType: 'trajectory_msgs/JointTrajectory',
        })

    // Sider - obsługa 1
    const slider = document.getElementById(`slider-${jointNr}`);
    slider.addEventListener("input", handleSliderChange);



    const handleUsedButtonClick = () => {
        if (connectionStatus === 'connected') {
            // Tworzenie wiadomości JointTrajectory
            const jointNames = ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7'];
            const valueMessage = new ROSLIB.Message({
                //joint_names: [jointNames[jointNr]],
                joint_names: jointNames,
                points: [{
                    positions: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5],
                    time_from_start: { sec: 2, nanosec: 0 } // Ustawienie czasu, możesz to dostosować
                }]
            });
            my_topic_publisher.publish(valueMessage);
            console.log(`Published value ${sliderValue} to ${jointNames[jointNr]}`);
        } else {
            console.log('Brak połączenia z ROSem');
        }

        
        //Animacja przyciśnięcia przycisku wysyłającego wartość
        setButtonClicked(true); 
        setTimeout(() => {
            setButtonClicked(false);
        }, 300);
    };

    const usedButton = document.getElementById(`button-${jointNr}`);
    usedButton.addEventListener("click", handleUsedButtonClick);
  

return () => {
    slider.removeEventListener("input", handleSliderChange)
    usedButton.removeEventListener("click", handleUsedButtonClick)
};

 
}, [ros, connectionStatus, sliderValue, jointNr])




    return (
        <div className="slider">
            <output id={`slider-value-${jointNr}`} className="outputValue">
                <strong>{sliderValue.toFixed(2)}</strong>
            </output>
            <div>
                <input
                id={`slider-${jointNr}`}
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step={0.1}
                value={sliderValue.toFixed(2)}
                onChange={handleSliderChange}
                style={{ marginRight: '10px' }} 
                />
                <button 
                    id={`button-${jointNr}`} 
                    className={buttonClicked ? "button-animation clicked" : "button-animation"}
                >                   
                <FontAwesomeIcon icon={faArrowRight} className="icon" />
                </button>
            </div>
        </div>
    )
}

export default SliderInput
