import React, { useState, useEffect } from 'react';
import { AlertTriangle, Bell, LogIn, FileText, Cable, Unplug } from 'lucide-react';


function TopBar({ connectionStatus }) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <button className="bg-red-500 text-white font-bold py-2 px-4 rounded">EMERGENCY STOP</button>
        <AlertTriangle className="h-6 w-6 text-yellow-500" />
        <Bell className="h-6 w-6" />
        <LogIn className="h-6 w-6" />
        <FileText className="h-6 w-6" />
      </div>
      <div className="flex items-center space-x-4">
        {connectionStatus === 'connected' ? (
          <Cable className="h-6 w-6 text-green-500" />
        ) : (
          <Unplug className="h-6 w-6 text-red-500" />
        )}
        <span>{connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}</span>
        <span>{formatTime(currentTime)}</span>
      </div>
    </div>
  );
}

export default TopBar;