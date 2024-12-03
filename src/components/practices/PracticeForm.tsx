import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Practice, Player } from '../../types';

interface PracticeFormProps {
  practice?: Practice | null;
  players: Player[];
  onSubmit: (data: Omit<Practice, 'id'>) => void;
  onClose: () => void;
}

const initialFormState = {
  date: '',
  attendees: [] as string[],
};

export default function PracticeForm({ practice, players, onSubmit, onClose }: PracticeFormProps) {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (practice) {
      setFormData({
        date: practice.date || '',
        attendees: practice.attendees || [],
      });
    } else {
      setFormData(initialFormState);
    }
  }, [practice]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handlePlayerToggle = (playerId: string) => {
    setFormData(prev => ({
      ...prev,
      attendees: prev.attendees.includes(playerId)
        ? prev.attendees.filter(id => id !== playerId)
        : [...prev.attendees, playerId],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {practice ? 'Edit Practice' : 'Add New Practice'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Practice Date
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attending Players
            </label>
            <div className="max-h-60 overflow-y-auto border rounded-md p-2">
              {players.map((player) => (
                <label
                  key={player.id}
                  className="flex items-center space-x-2 p-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={formData.attendees.includes(player.id)}
                    onChange={() => handlePlayerToggle(player.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>{player.fullName}</span>
                </label>
              ))}
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
              {practice ? 'Save Changes' : 'Add Practice'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}