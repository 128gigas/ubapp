import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Match, Player } from '../types';
import { matchService } from '../services/matchService';
import { playerService } from '../services/playerService';
import MatchList from '../components/matches/MatchList';
import MatchForm from '../components/matches/MatchForm';

export default function Matches() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMatch, setEditingMatch] = useState<Match | null>(null);

  useEffect(() => {
    fetchMatches();
    fetchPlayers();
  }, []);

  const fetchMatches = async () => {
    const matches = await matchService.getAll();
    setMatches(matches);
  };

  const fetchPlayers = async () => {
    const players = await playerService.getAll();
    setPlayers(players);
  };

  const handleEdit = (match: Match) => {
    setEditingMatch(match);
    setIsFormOpen(true);
  };

  const handleDelete = async (matchId: string) => {
    if (!confirm('Are you sure you want to delete this match?')) return;

    const { error } = await matchService.delete(matchId);
    if (error) {
      console.error('Error deleting match:', error);
      return;
    }

    await fetchMatches();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingMatch(null);
  };

  const handleFormSubmit = async (matchData: Omit<Match, 'id'>) => {
    const { error } = editingMatch
      ? await matchService.update(editingMatch.id, matchData)
      : await matchService.create(matchData);

    if (error) {
      console.error('Error saving match:', error);
      return;
    }

    handleFormClose();
    await fetchMatches();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Match Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-700"
        >
          <Plus size={20} />
          <span>Add Match</span>
        </button>
      </div>

      <MatchList
        matches={matches}
        players={players}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <MatchForm
          match={editingMatch}
          players={players}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}