import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Player } from '../types';
import { playerService } from '../services/playerService';

export default function PlayerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Player[]>([]);
  const navigate = useNavigate();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.length >= 2) {
      const players = await playerService.search(term);
      setSearchResults(players);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Player Search</h1>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search players..."
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        />
      </div>

      {searchResults.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {searchResults.map((player) => (
              <li key={player.id}>
                <button
                  onClick={() => navigate(`/player/${player.id}`)}
                  className="w-full hover:bg-gray-50"
                >
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div className="flex items-center">
                        <img
                          className="h-12 w-12 rounded-full"
                          src={player.profilePhoto || 'https://via.placeholder.com/48'}
                          alt={player.fullName}
                        />
                        <div className="ml-4">
                          <p className="text-sm font-medium text-indigo-600 truncate">
                            {player.fullName}
                          </p>
                          <p className="mt-1 text-sm text-gray-500">
                            {player.position || 'Position not specified'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {searchTerm && searchResults.length === 0 && (
        <p className="text-center text-gray-500 py-4">No players found</p>
      )}
    </div>
  );
}