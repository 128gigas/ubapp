import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '../../lib/supabase';
import { Player } from '../../types';

export default function PlayerStats() {
  const [topScorers, setTopScorers] = useState<Player[]>([]);

  useEffect(() => {
    fetchTopScorers();
  }, []);

  const fetchTopScorers = async () => {
    const { data } = await supabase
      .from('players')
      .select('*')
      .order('goalsScored', { ascending: false })
      .limit(5);

    setTopScorers(data || []);
  };

  const chartData = topScorers.map(player => ({
    name: player.fullName.split(' ')[0],
    goals: player.goalsScored,
  }));

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Scorers</h2>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="goals" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}