import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { Practice, Player } from '../types';
import { practiceService } from '../services/practiceService';
import { playerService } from '../services/playerService';
import PracticeList from '../components/practices/PracticeList';
import PracticeForm from '../components/practices/PracticeForm';

export default function Practices() {
  const [practices, setPractices] = useState<Practice[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPractice, setEditingPractice] = useState<Practice | null>(null);

  useEffect(() => {
    fetchPractices();
    fetchPlayers();
  }, []);

  const fetchPractices = async () => {
    const practices = await practiceService.getAll();
    setPractices(practices);
  };

  const fetchPlayers = async () => {
    const players = await playerService.getAll();
    setPlayers(players);
  };

  const handleEdit = (practice: Practice) => {
    setEditingPractice(practice);
    setIsFormOpen(true);
  };

  const handleDelete = async (practiceId: string) => {
    if (!confirm('Are you sure you want to delete this practice?')) return;

    const { error } = await practiceService.delete(practiceId);
    if (error) {
      console.error('Error deleting practice:', error);
      return;
    }

    await fetchPractices();
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingPractice(null);
  };

  const handleFormSubmit = async (practiceData: Omit<Practice, 'id'>) => {
    const { error } = editingPractice
      ? await practiceService.update(editingPractice.id, practiceData)
      : await practiceService.create(practiceData);

    if (error) {
      console.error('Error saving practice:', error);
      return;
    }

    handleFormClose();
    await fetchPractices();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Practice Management</h1>
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 hover:bg-indigo-700"
        >
          <Plus size={20} />
          <span>Add Practice</span>
        </button>
      </div>

      <PracticeList
        practices={practices}
        players={players}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {isFormOpen && (
        <PracticeForm
          practice={editingPractice}
          players={players}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}