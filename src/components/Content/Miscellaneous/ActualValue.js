import React, {useState, useEffect} from 'react';
import ROSLIB from 'roslib';
import './ActualValue.css';

function ActualValue ({ros, connectionStatus, jointToChange}) {
    const [actualValue, setActualValue] = useState(0) 
    const [valueRead, setValueRead] = useState(false)

    
    useEffect(() => {

        //Tworzenie obiektu listenera do odbierania wartości
        const my_topic_listener = new ROSLIB.Topic({
            ros,
            name: "/response_topic",
            messageType: "std_msgs/Float64MultiArray",
        });

        const handleNewMessage = (message) => {
            setActualValue(message.data[jointToChange]); //actualValue wyciągnęte z obiektu message pola data
            //adnimacja odczytania wartości
            setValueRead(true)
            setTimeout(() => {
                setValueRead(false);
            }, 300);
        }

        my_topic_listener.subscribe(handleNewMessage)

        return () => {
            my_topic_listener.unsubscribe();
        };
    }, [ros, connectionStatus, actualValue, jointToChange])

    //Ustalenie dwóch miejsc po przecinku
    const formattedValue = actualValue.toFixed(2); 
   

return (
    <div className={valueRead ? "value-animation read" : "value-animation"}>
        <output id={`actual-value-${jointToChange}`} >
            {formattedValue}
        </output>
    </div>
);

}


export default ActualValue