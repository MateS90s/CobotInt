import React, {useState, useEffect} from 'react';
import ROSLIB from 'roslib';

function ActualValue ({ros, connectionStatus}) {
    const [actualValue, setActualValue] = useState(0) 

    useEffect(() => {

        //Tworzenie obiektu listenera do odbierania wartości
        const my_topic_listener = new ROSLIB.Topic({
            ros,
            name: "/joint_state_publisher",
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
        <output id="value">Wartość w ROS2: {actualValue}</output>
    </div>
);

}


export default ActualValue