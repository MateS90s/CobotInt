import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

function SmartControl() {
    const videoRef = useRef(null);  // Referencja do elementu <video>
    const [peer, setPeer] = useState(null);  // Peer WebRTC
    const signalingServerUrl = 'http://IP_ADDRESS/streaming/webrtc-demo';  // Wprowadź adres IP
 
    // Funkcja do rozpoczęcia połączenia WebRTC
    const initializePeer = async  () => {
        const newPeer = new Peer({
            initiator: true,  // Aplikacja inicjuje połączenie
            trickle: false,  // trickle to opcja ICE candidates - szukanie najlepsze ścieżki pomiędzy NATami i firewallami - false - jak znajdzie najepszą ścieżkę po sieci to dopiero wtedy strumieniuje
        });

        // Obsługa wydarzenia "signal" do przesyłania sygnałów WebRTC
        newPeer.on('signal', async (data) => {  // ustawienie że fukcja będzie asynchorniczna - nie zblokuje reszty programu jak będzie się wykonywać
                                                // data to obiekt, który został wypełniony warościami jak stworzyliśmy obiekt new newPeer  
            console.log('Sending offer', data);  // Będziemy później potrzebować tego sygnału do komunikacji

            //Wysyłamy offer do Nucleus
            const response = await fetch(signalingServerUrl, { //await ustalenie że ta fukcja będzie synchroniczna ale tylko wewnąrtze fukcji async - która jest asynchroniczna
                method: 'POST',
                headers: {
                    'COntent-type': 'application/json'
                },
                body: JSON.stringify(data) //Przesyłamy sygnał WebRTC (offer)
            });

            //Odbieramy odpowiedź (anwer) z serwera
            const answer = await response.json(); // fn będzie synchroniczna i czeka na swó start jak poprzedni await się skończy
            console.log('Received answer', answer);

            // Przekazujemy odpowiedź z serwera do peer-a
            newPeer.signal(answer);
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
