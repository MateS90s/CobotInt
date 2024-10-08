import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';

function SmartControl() {
  const videoRef = useRef(null);  // Referencja do elementu <video>
  const [peer, setPeer] = useState(null);  // Peer WebRTC
  const [signalingServerUrl, setSignalingServerUrl] = useState('');  // Przechowywanie adresu URL

  // Funkcja do rozpoczęcia połączenia WebRTC
  const initializePeer = async () => {
    if (!signalingServerUrl) {
      alert('Proszę wprowadzić adres URL serwera sygnalizacyjnego.');
      return;
    }

    const newPeer = new Peer({
      initiator: true,  // Aplikacja inicjuje połączenie
      trickle: false,  // trickle to opcja ICE candidates
    });

    // Obsługa wydarzenia "signal" do przesyłania sygnałów WebRTC
    newPeer.on('signal', async (data) => {
      console.log('Sending offer', data);

      // Wysyłamy offer do Nucleus
      const response = await fetch(signalingServerUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),  // Przesyłamy sygnał WebRTC (offer)
      });

      // Odbieramy odpowiedź (answer) z serwera
      const answer = await response.json();
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
    if (signalingServerUrl) {
      initializePeer();
    }
  }, [signalingServerUrl]);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-800">Smart Control</h1>
      
      {/* Pole do wpisania adresu URL */}
      <input 
        type="text" 
        value={signalingServerUrl} 
        onChange={(e) => setSignalingServerUrl(e.target.value)} 
        placeholder="Wprowadź adres URL serwera sygnalizacyjnego"
        className="border p-2 mb-4 w-full"
      />
      
      <button 
        onClick={initializePeer} 
        className="bg-blue-500 text-white p-2 rounded"
      >
        Połącz
      </button>

      {/* Wideo */}
      <video ref={videoRef} autoPlay playsInline controls={false} style={{ width: '100%', height: 'auto', border: '1px solid black' }} />
    </div>
  );
}

export default SmartControl;
