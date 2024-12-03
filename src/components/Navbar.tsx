import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Calendar, Trophy, LayoutDashboard, Search } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-bold text-xl">Team Manager</Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive('/') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/team"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive('/team') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <Users size={20} />
              <span>Team</span>
            </Link>
            <Link
              to="/practices"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive('/practices') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <Calendar size={20} />
              <span>Practices</span>
            </Link>
            <Link
              to="/matches"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive('/matches') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <Trophy size={20} />
              <span>Matches</span>
            </Link>
            <Link
              to="/search"
              className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                isActive('/search') ? 'bg-indigo-700' : 'hover:bg-indigo-700'
              }`}
            >
              <Search size={20} />
              <span>Search</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;