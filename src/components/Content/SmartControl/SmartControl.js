import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

function SmartControl() {
    const videoRef = useRef(null);  // Referencja do elementu <video>
    const [peer, setPeer] = useState(null);  // Peer WebRTC
 
    // Funkcja do rozpoczęcia połączenia WebRTC
    const initializePeer = () => {
        const newPeer = new Peer({
            initiator: true,  // Aplikacja inicjuje połączenie
            trickle: false,
            stream: null,  // Na razie nie mamy streamu wideo
        });

        // Obsługa wydarzenia "signal" do przesyłania sygnałów WebRTC
        newPeer.on('signal', (data) => {
            console.log('SIGNAL', data);  // Będziemy później potrzebować tego sygnału do komunikacji
        });
    
        // Gdy peer otrzyma strumień wideo, wyświetlamy go w elemencie <video>
        newPeer.on('stream', (stream) => {
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        });

        setPeer(newPeer);

    };
 
    // Inicjujemy połączenie WebRTC po załadowaniu komponentu
    useEffect(() => {
        initializePeer();
    }, []);

    return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800">Smart control</h1>
      <video ref={videoRef} autoPlay playsInline controls={false} style={{ width: '100%', height: 'auto', border: '1px solid black' }} />
    </div>
  );
}

export default SmartControl;
