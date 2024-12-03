import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Match, Player } from '../../types';
import { supabase } from '../../lib/supabase';

interface MatchFormProps {
  match?: Match | null;
  players: Player[];
  onSubmit: (data: Omit<Match, 'id'>) => void;
  onClose: () => void;
}

interface PlayerParticipation {
  playerId: string;
  minutesPlayed: number;
  substitutionTime?: number;
}

export default function MatchForm({ match, players, onSubmit, onClose }: MatchFormProps) {
  const [formData, setFormData] = useState({
    date: '',
    rival: '',
    result: {
      homeScore: 0,
      awayScore: 0,
    },
    players: [] as PlayerParticipation[],
  });

  const [rivals, setRivals] = useState<string[]>([]);

  useEffect(() => {
    if (match) {
      setFormData({
        date: match.date,
        rival: match.rival,
        result: match.result,
        players: match.players,
      });
    }
    fetchRivals();
  }, [match]);

  const fetchRivals = async () => {
    const { data } = await supabase
      .from('matches')
      .select('rival')
      .order('rival');
    
    if (data) {
      const uniqueRivals = [...new Set(data.map(m => m.rival))];
      setRivals(uniqueRivals);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePlayerAdd = (playerId: string) => {
    if (!formData.players.find(p => p.playerId === playerId)) {
      setFormData(prev => ({
        ...prev,
        players: [...prev.players, { playerId, minutesPlayed: 90 }],
      }));
    }
  };

  const handlePlayerRemove = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.filter(p => p.playerId !== playerId),
    }));
  };

  const updatePlayerStats = (playerId: string, field: keyof PlayerParticipation, value: number) => {
    setFormData(prev => ({
      ...prev,
      players: prev.players.map(p =>
        p.playerId === playerId ? { ...p, [field]: value } : p
      ),
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {match ? 'Edit Match' : 'Add New Match'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Match Date
              </label>
              <input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Rival Team
              </label>
              <input
                type="text"
                list="rivals"
                value={formData.rival}
                onChange={(e) => setFormData(prev => ({ ...prev, rival: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
              <datalist id="rivals">
                {rivals.map(rival => (
                  <option key={rival} value={rival} />
                ))}
              </datalist>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Home Score
              </label>
              <input
                type="number"
                min="0"
                value={formData.result.homeScore}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  result: { ...prev.result, homeScore: parseInt(e.target.value) || 0 }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Away Score
              </label>
              <input
                type="number"
                min="0"
                value={formData.result.awayScore}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  result: { ...prev.result, awayScore: parseInt(e.target.value) || 0 }
                }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Player Participation
            </label>
            <div className="space-y-4">
              {players.map((player) => {
                const participation = formData.players.find(p => p.playerId === player.id);
                return (
                  <div key={player.id} className="flex items-center space-x-4 p-2 bg-gray-50 rounded-md">
                    <div className="flex-1">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={!!participation}
                          onChange={() => participation
                            ? handlePlayerRemove(player.id)
                            : handlePlayerAdd(player.id)
                          }
                          className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span>{player.fullName}</span>
                      </label>
                    </div>
                    
                    {participation && (
                      <>
                        <div className="w-32">
                          <label className="block text-xs text-gray-500">Minutes</label>
                          <input
                            type="number"
                            min="0"
                            max="90"
                            value={participation.minutesPlayed}
                            onChange={(e) => updatePlayerStats(
                              player.id,
                              'minutesPlayed',
                              parseInt(e.target.value) || 0
                            )}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="w-32">
                          <label className="block text-xs text-gray-500">Sub Time</label>
                          <input
                            type="number"
                            min="0"
                            max="90"
                            value={participation.substitutionTime || ''}
                            onChange={(e) => updatePlayerStats(
                              player.id,
                              'substitutionTime',
                              parseInt(e.target.value) || undefined
                            )}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                          />
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              {match ? 'Save Changes' : 'Add Match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}