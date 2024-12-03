import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Match } from '../../types';
import { formatDate } from '../../utils/dateUtils';

export default function RecentMatches() {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    fetchRecentMatches();
  }, []);

  const fetchRecentMatches = async () => {
    const { data } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false })
      .limit(5);

    setMatches(data || []);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Matches</h2>
      <div className="space-y-4">
        {matches.map((match) => (
          <div
            key={match.id}
            className="flex items-center justify-between border-b pb-4 last:border-0"
          >
            <div>
              <p className="font-medium text-gray-900">vs {match.rival}</p>
              <p className="text-sm text-gray-500">{formatDate(match.date)}</p>
            </div>
            <div className="text-lg font-semibold">
              {match.result.homeScore} - {match.result.awayScore}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}