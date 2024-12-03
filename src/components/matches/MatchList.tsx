import React from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { Match, Player } from '../../types';
import { formatDate } from '../../utils/dateUtils';

interface MatchListProps {
  matches: Match[];
  players: Player[];
  onEdit: (match: Match) => void;
  onDelete: (matchId: string) => void;
}

export default function MatchList({ matches, players, onEdit, onDelete }: MatchListProps) {
  const getPlayerName = (playerId: string): string => {
    return players.find(p => p.id === playerId)?.fullName || '';
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
              Rival
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Result
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Players
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {matches.map((match) => (
            <tr key={match.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {formatDate(match.date)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {match.rival}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {match.result.homeScore} - {match.result.awayScore}
              </td>
              <td className="px-6 py-4 text-sm text-gray-500">
                <div className="max-w-md">
                  {match.players.map((p, i) => (
                    <div key={p.playerId} className="text-sm">
                      {getPlayerName(p.playerId)}
                      {p.substitutionTime && ` (Sub: ${p.substitutionTime}')`}
                      {i < match.players.length - 1 ? ', ' : ''}
                    </div>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-3">
                  <button
                    onClick={() => onEdit(match)}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(match.id)}
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