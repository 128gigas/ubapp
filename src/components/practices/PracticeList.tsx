import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Practice, Player } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface PracticeListProps {
  practices: Practice[];
  players: Player[];
  onEdit: (practice: Practice) => void;
  onDelete: (practiceId: string) => void;
}

export default function PracticeList({ practices, players, onEdit, onDelete }: PracticeListProps) {
  const getPlayerNames = (playerIds: string[]): string => {
    return playerIds
      .map(id => players.find(p => p.id === id)?.fullName)
      .filter(Boolean)
      .join(', ');
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Attending Players
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {practices.map((practice) => (
            <tr key={practice.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(practice.date)}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="max-w-md truncate">
                  {getPlayerNames(practice.attendees)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(practice)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(practice.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}