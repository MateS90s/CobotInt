import React, {useState, useEffect} from 'react';
import ROSLIB from 'roslib';

function ActualValue ({ros, connectionStatus}) {
    const [actualValue, setActualValue] = useState(0) 

    useEffect(() => {

        //Tworzenie obiektu listenera do odbierania wartości
        const my_topic_listener = new ROSLIB.Topic({
            ros,
            name: "/response_topic",
            messageType: "std_msgs/Float64",
        });

        my_topic_listener.subscribe((message) => {
                setActualValue(message.data) //actualValue wyciągnęte z obiektu message pola data
            })

        return () => {
            my_topic_listener.unsubscribe();
        };
    }, [ros, connectionStatus])

   

return (
    <div>
        <output id="value" style={{ color: 'green', width: '50px', textAlign: 'center' }}>
            <strong>{actualValue.toFixed(2)}</strong>
        </output>
    </div>
);

}


export default ActualValue