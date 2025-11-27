import React, { useState } from 'react';

function StatusBar({ connectionStatus, connectToRos, disconnectFromRos }) {
  const [address, setAddress] = useState('ws://localhost:9091');

  const handleConnect = () => {
    if (connectionStatus === "connected") {
      console.log('Connection is already established');
      return;
    }
    connectToRos(address);
  };

  return (
      <div className="flex justify-between items-center px-4 py-2">
        <div className="flex items-center space-x-2">
          <span>Status: </span>
          <span className={`px-2 py-1 rounded ${
            connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}>
            {connectionStatus}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <input 
            type="text" 
            className="px-2 py-1 border rounded"
            placeholder="Adres ROSbridge" 
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button 
            onClick={handleConnect}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Connect
          </button>
          <button 
            onClick={disconnectFromRos}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Disconnect
          </button>
        </div>
        <div>
          <span>Mode: --Auto/Hand--</span>
        </div>
        <div>
          <span>Task: --Paint/Weld--</span>
        </div>
      </div>
  );
}

export default StatusBar;
