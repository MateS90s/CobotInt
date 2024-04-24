import React, { useState, useEffect} from 'react';
import ROSLIB from 'roslib';
import './SliderInput.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight  } from '@fortawesome/free-solid-svg-icons';

function SliderInput ({ros, connectionStatus, jointToChange}) {
    const [sliderValue, setSliderValue] = useState(0);
    const [buttonClicked, setButtonClicked] = useState(false);

// Dodanie obsługi slidera
const handleSliderChange = (event) => {
    const newValue = parseFloat(event.target.value)
    setSliderValue(newValue);
}

 useEffect(() => {

    // Tworzenie obiektu publishera do nadawania wiadomości 
    const my_topic_publisher = new ROSLIB.Topic({
        ros,
        name: "/joint_state_publisher",
        messageType: "std_msgs/Float64MultiArray",
        })


    const slider = document.getElementById(`slider-${jointToChange}`);
    slider.addEventListener("input", handleSliderChange);


    const handelUsedButtonClick = () => {
        if (connectionStatus === 'connected') {
            const valueMessage = new ROSLIB.Message({
                data: [0, 0, 0, 0, 0, 0, 0]
            });
            valueMessage.data[jointToChange] = parseFloat(sliderValue)
            my_topic_publisher.publish(valueMessage);
        } else {
            console.log("Brak połączenia z ROSem");
        }
        //Animacja przyciśnięcia przycisku wysyłającego wartość
        setButtonClicked(true); 
        setTimeout(() => {
            setButtonClicked(false);
        }, 300);
    };

    const usedButton = document.getElementById(`button-${jointToChange}`);
    usedButton.addEventListener("click", handelUsedButtonClick);
  

return () => {
    slider.removeEventListener("input", handleSliderChange)
    usedButton.removeEventListener("click", handelUsedButtonClick)
};

 
}, [ros, connectionStatus, sliderValue, jointToChange])




    return (
        <div className="slider">
            <output id={`slider-value-${jointToChange}`} className="outputValue">
                <strong>{sliderValue.toFixed(2)}</strong>
            </output>
            <div>
                <input
                id={`slider-${jointToChange}`}
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step={0.1}
                value={sliderValue.toFixed(2)}
                onChange={handleSliderChange}
                style={{ marginRight: '10px' }} 
                />
                <button 
                    id={`button-${jointToChange}`} 
                    className={buttonClicked ? "button-animation clicked" : "button-animation"}
                >                   
                <FontAwesomeIcon icon={faArrowRight} className="icon" />
                </button>
            </div>
        </div>
    )
}

export default SliderInput
