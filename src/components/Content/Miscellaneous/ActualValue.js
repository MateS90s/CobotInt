import React, {useState, useEffect} from 'react';
import ROSLIB from 'roslib';
import './ActualValue.css';

function ActualValue ({ros, connectionStatus, jointNr}) {
    const [actualValue, setActualValue] = useState(0) 
    const [valueRead, setValueRead] = useState(false)

    
    useEffect(() => {

        //Tworzenie obiektu listenera do odbierania wartości
        const my_topic_listener = new ROSLIB.Topic({
            ros,
            name: "/lbr/joint_states",
            messageType: "sensor_msgs/JointState",
        });


        
        const handleNewMessage = (message) => {
            console.log('Received message:', message);

            // Sprawdzenie struktury wiadomości
            if (message && message.position) {
                setActualValue(message.position[jointNr]); // Odczytaj wartość dla pierwszego przegubu

                // Animacja odczytania wartości
                setValueRead(true);
                setTimeout(() => {
                    setValueRead(false);
                }, 300);
            } else {
                console.error('Incorrect message structure:', message);
            }
        };



        my_topic_listener.subscribe(handleNewMessage)

        return () => {
            my_topic_listener.unsubscribe();
        };
    }, [ros, connectionStatus, actualValue, jointNr])

    //Ustalenie dwóch miejsc po przecinku
    const formattedValue = actualValue.toFixed(2); 
   

return (
    <div className={valueRead ? "value-animation read" : "value-animation"}>
        <output id={`actual-value-${jointNr}`} >
            {formattedValue}
        </output>
    </div>
);

}


export default ActualValue