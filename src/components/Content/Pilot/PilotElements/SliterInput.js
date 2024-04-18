import React, { useState, useEffect} from 'react';
import ROSLIB from 'roslib';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight  } from '@fortawesome/free-solid-svg-icons';

function SliderInput ({ros, connectionStatus}) {
    const [sliderValue, setSliderValue] = useState(0)

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
        messageType: "std_msgs/Float64",
        })


    const slider = document.getElementById("slider_");
    slider.addEventListener("input", handleSliderChange);


    const handelUpButtonClick = () => {
        if (connectionStatus === 'connected') {
            const valueMessage = new ROSLIB.Message({
                data: parseFloat(sliderValue)
            });
            my_topic_publisher.publish(valueMessage);
        } else {
            console.log("Brak połączenia z ROSem");
        }

    };

    const upButton = document.getElementById("button_");
    upButton.addEventListener("click", handelUpButtonClick);

return () => {
    slider.removeEventListener("input", handleSliderChange)
    upButton.removeEventListener("click", handelUpButtonClick)
};

 
}, [ros, connectionStatus, sliderValue])




    return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <output id="value" style={{ color: '#007bff', width: '50px', textAlign: 'center' }}>
                <strong>{sliderValue.toFixed(2)}</strong>
            </output>
            <div>
                <input
                id="slider_"
                type="range"
                min={-Math.PI}
                max={Math.PI}
                step={0.1}
                value={sliderValue.toFixed(2)}
                onChange={handleSliderChange}
                style={{ marginRight: '10px' }} 
                />
                <button id="button_" style={{ marginRight: '10px', border: "0" }}>
                    <FontAwesomeIcon icon={faArrowRight} style={{ color: '#007bff', fontSize: '2em' }} />
                </button>
            </div>
        </div>
    )
}

export default SliderInput
