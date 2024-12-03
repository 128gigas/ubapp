import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Player } from '../../types';
import { formatDateForInput } from '../../utils/dateUtils';

interface PlayerFormProps {
  player?: Player | null;
  onSubmit: (data: Omit<Player, 'id'>) => void;
  onClose: () => void;
}

const positions = [
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward',
];

const initialFormState = {
  profilePhoto: '',
  fullName: '',
  dateOfBirth: '',
  healthCardExpiration: '',
  goalsScored: 0,
  goalsAgainst: 0,
  position: '',
};

export default function PlayerForm({ player, onSubmit, onClose }: PlayerFormProps) {
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (player) {
      setFormData({
        profilePhoto: player.profilePhoto || '',
        fullName: player.fullName || '',
        dateOfBirth: formatDateForInput(player.dateOfBirth) || '',
        healthCardExpiration: formatDateForInput(player.healthCardExpiration) || '',
        goalsScored: player.goalsScored || 0,
        goalsAgainst: player.goalsAgainst || 0,
        position: player.position || '',
      });
    } else {
      setFormData(initialFormState);
    }
  }, [player]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
      healthCardExpiration: new Date(formData.healthCardExpiration).toISOString(),
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value ? parseInt(value) : 0) : value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            {player ? 'Edit Player' : 'Add New Player'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Profile Photo URL
            </label>
            <input
              type="url"
              name="profilePhoto"
              value={formData.profilePhoto}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              required
              value={formData.fullName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">Select position...</option>
              {positions.map(pos => (
                <option key={pos} value={pos}>{pos}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Date of Birth
            </label>
            <input
              type="date"
              name="dateOfBirth"
              required
              value={formData.dateOfBirth}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Health Card Expiration
            </label>
            <input
              type="date"
              name="healthCardExpiration"
              required
              value={formData.healthCardExpiration}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Goals Scored
              </label>
              <input
                type="number"
                name="goalsScored"
                min="0"
                value={formData.goalsScored}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Goals Against
              </label>
              <input
                type="number"
                name="goalsAgainst"
                min="0"
                value={formData.goalsAgainst}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
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
              {player ? 'Save Changes' : 'Add Player'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}