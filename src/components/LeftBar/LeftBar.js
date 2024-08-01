import React from 'react';
import { Link } from 'react-router-dom';
import { Menu } from 'lucide-react';

function LeftBar({ isOpen, setIsOpen }) {
  return (
    <div className={`bg-gray-800 text-white ${isOpen ? 'w-64' : 'w-16'} transition-all duration-300 ease-in-out`}>
      <div className="p-4">
        <Menu className="h-8 w-8 cursor-pointer" onClick={() => setIsOpen(!isOpen)} />
      </div>
      {isOpen && (
        <nav className="mt-8">
          <Link to="/" className="block py-2 px-4 hover:bg-gray-700">Dashboard</Link>
          <Link to="/pilot" className="block py-2 px-4 hover:bg-gray-700">Manual control</Link>
          <Link to="/program-builder" className="block py-2 px-4 hover:bg-gray-700">Program builder</Link>
          <Link to="/program-builder" className="block py-2 px-4 hover:bg-gray-700">Settings</Link>
        </nav>
      )}
    </div>
  );
}

export default LeftBar;