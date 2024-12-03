import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Player } from '../types';
import { playerService } from '../services/playerService';
import PlayerForm from '../components/team/PlayerForm';
import PlayerList from '../components/team/PlayerList';

export default function Team() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    const players = await playerService.getAll();
    setPlayers(players);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setIsFormOpen(true);
  };

  const handleDelete = async (playerId: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    const { error } = await playerService.delete(playerId);
    if (error) {
      console.error('Error deleting player:', error);
      return;
    }

    await fetchPlayers();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPlayer(null);
  };

  const handleFormSubmit = async (playerData: Omit<Player, 'id'>) => {
    const { error } = editingPlayer
      ? await playerService.update(editingPlayer.id, playerData)
      : await playerService.create(playerData);

    if (error) {
      console.error('Error saving player:', error);
      return;
    }

    handleFormClose();
    await fetchPlayers();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Team Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-700"
        >
          <Plus size={20} />
          <span>Add Player</span>
        </button>
      </div>

      <PlayerList
        players={players}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <PlayerForm
          player={editingPlayer}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}