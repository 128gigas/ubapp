import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2, ExternalLink } from 'lucide-react';
import { Player } from '../../types';
import { formatDate, calculateDaysRemaining, formatDaysRemaining } from '../../utils/dateUtils';

interface PlayerListProps {
  players: Player[];
  onEdit: (player: Player) => void;
  onDelete: (playerId: string) => void;
}

export default function PlayerList({ players, onEdit, onDelete }: PlayerListProps) {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Player
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date of Birth
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Health Card Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Position
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Goals
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {players.map((player) => {
            const daysRemaining = calculateDaysRemaining(player.healthCardExpiration);
            const healthCardStatus = formatDaysRemaining(daysRemaining);
            const isExpiringSoon = daysRemaining <= 30 && daysRemaining >= 0;
            const isExpired = daysRemaining < 0;

            return (
              <tr key={player.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={player.profilePhoto || 'https://via.placeholder.com/40'}
                        alt={player.fullName}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {player.fullName}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(player.dateOfBirth)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      isExpired
                        ? 'bg-red-100 text-red-800'
                        : isExpiringSoon
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {healthCardStatus}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.position || 'Not specified'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {player.goalsScored} / {player.goalsAgainst}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex space-x-3">
                    <Link
                      to={`/player/${player.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <ExternalLink size={18} />
                    </Link>
                    <button
                      onClick={() => onEdit(player)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(player.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}