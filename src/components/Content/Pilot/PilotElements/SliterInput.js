import React, { useState, useEffect} from 'react';
import ROSLIB from 'roslib';

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
        <div>
        <input
          id = "slider_"
          type="range"
          min={0}
          max={360}
          step={0.1}
          value={sliderValue}
          onChange={handleSliderChange}
        />
        
        <p>Aktualna wartość suwaka: {sliderValue}</p>
        <button id="button_">Wyślij</button>
        </div>
    )
}

export default SliderInput
