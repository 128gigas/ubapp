import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Team from './pages/Team';
import Practices from './pages/Practices';
import Matches from './pages/Matches';
import PlayerProfile from './pages/PlayerProfile';
import PlayerSearch from './pages/PlayerSearch';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/team" element={<Team />} />
            <Route path="/practices" element={<Practices />} />
            <Route path="/matches" element={<Matches />} />
            <Route path="/player/:id" element={<PlayerProfile />} />
            <Route path="/search" element={<PlayerSearch />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;