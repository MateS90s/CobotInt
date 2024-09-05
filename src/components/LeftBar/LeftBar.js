import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

function LeftBar({ isSidebarOpen, setIsSidebarOpen }) {
  return (
    <aside className={`bg-gray-800 text-white transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-16'}`}>
      <div className={`bg-gray-800 text-white ${isSidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}>
        <div className="p-4 flex justify-between items-center">
          <span className={isSidebarOpen ? '' : 'hidden'}>Robotico HMI</span>
          <Menu className="h-6 w-6 cursor-pointer" onClick={() => setIsSidebarOpen(!isSidebarOpen)} />
        </div>
        {isSidebarOpen && (
          <nav className="mt-8">
            <Link to="/" className="block py-2 px-4 hover:bg-gray-700">Dashboard</Link>
            <Link to="/pilot" className="block py-2 px-4 hover:bg-gray-700">Manual control</Link>
            <Link to="/smart-control" className="block py-2 px-4 hover:bg-gray-700">Smart control</Link>
            <Link to="/program-builder" className="block py-2 px-4 hover:bg-gray-700">Program builder</Link>
            <Link to="/program-builder" className="block py-2 px-4 hover:bg-gray-700">Settings</Link>
          </nav>
        )}
      </div>
    </aside>
  );
}

export default LeftBar;