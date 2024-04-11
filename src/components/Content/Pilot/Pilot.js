import React, { useState, useEffect } from 'react';
import ROSLIB from 'roslib';

import './Pilot.scss'
import '../ComponentStylesMain.scss'


function Pilot({ connectionStatus }) {
    const [messages, setMesseges] = useState([]);

    useEffect(() => {
   if (connectionStatus === 'connected') {
        // Tworzenie obiektu listenera do odbierania wiadomości 
        const ros = new ROSLIB.Ros({ url: "ws://localhost:9091" });
        const my_topic_listener = new ROSLIB.Topic({
            ros,
            name: "/my_topic",
            messageType: "std_msgs/String",
        });


        // Odbieranie wiadomości
        my_topic_listener.subscribe((message) => {
            setMesseges(prevMessages => [...prevMessages, message.data]);
        });


        // Tworzenie obiektu publishera do nadawania wiadomości 
        const my_topic_publisher = new ROSLIB.Topic({
        ros,
        name: "/publishing_topic",
        messageType: "std_msgs/String",
        })
        // Dodanie obsługi kliknięcia przycisku "UP"
        const handelUpButtonClick = () => {
            const helloMessage = new ROSLIB.Message({
                data: 'Naciśnięte UP'
            });
            my_topic_publisher.publish(helloMessage);
        };

        const upButton = document.getElementById("up-button");
        upButton.addEventListener("click", handelUpButtonClick);

        //Zakończenie fukcji - zakończenie subskrybcji listenerów po odmontowywaniu komponentu
        return () => {
            my_topic_listener.unsubscribe();
            upButton.removeEventListener("click", handelUpButtonClick)
        };
    }
}, [connectionStatus]);
  

  return (
    <div className="pilot-content"> 
      <h1>Pilocik</h1>
      {connectionStatus === 'connected' ? (
        <>
            <button id="up-button" className="arrow-button">UP</button>
            <div>
                    <p><code>/my_topic</code> messages received: 
                    <ul>{messages.map((msg, index) => <li key ={index}>{msg}</li>)}</ul>
                </p>
            </div>
        </>
      ) : ( <p>Brak połączenia z ROSem</p> )}     
    </div>
  );
}



export default Pilot
