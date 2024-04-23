import React, {useState, useEffect} from 'react';
import ROSLIB from 'roslib';
import './ActualValue.css';

function ActualValue ({ros, connectionStatus}) {
    const [actualValue, setActualValue] = useState(0) 
    const [valueRead, setValueRead] = useState(false)

    
    useEffect(() => {

        //Tworzenie obiektu listenera do odbierania wartości
        const my_topic_listener = new ROSLIB.Topic({
            ros,
            name: "/response_topic",
            messageType: "std_msgs/Float64",
        });

        const handleNewMessage = (message) => {
            setActualValue(message.data); //actualValue wyciągnęte z obiektu message pola data
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
    }, [ros, connectionStatus, actualValue])

    //Ustalenie dwóch miejsc po przecinku
    const formattedValue = actualValue.toFixed(2); 
   

return (
    <div className={valueRead ? "value-animation read" : "value-animation"}>
        <output id="value" >
            {formattedValue}
        </output>
    </div>
);

}


export default ActualValue