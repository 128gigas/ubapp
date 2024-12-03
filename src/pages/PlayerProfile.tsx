import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { supabase } from '../lib/supabase';
import { Player, Practice, Match } from '../types';
import { formatDate } from '../utils/dateUtils';

export default function PlayerProfile() {
  const { id } = useParams();
  const [player, setPlayer] = useState<Player | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    if (id) {
      fetchPlayerData();
      fetchPlayerPractices();
      fetchPlayerMatches();
    }
  }, [id]);

  const fetchPlayerData = async () => {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching player:', error);
      return;
    }

    setPlayer(data);
  };

  const fetchPlayerPractices = async () => {
    const { data, error } = await supabase
      .from('practice_attendance')
      .select(`
        practice:practices (
          id,
          date,
          notes
        )
      `)
      .eq('player_id', id)
      .eq('status', 'present');

    if (error) {
      console.error('Error fetching practices:', error);
      return;
    }

    // Transform the data to match our Practice type
    const practicesData = data?.map(item => ({
      id: item.practice.id,
      date: item.practice.date,
      notes: item.practice.notes,
      attendees: [id], // Since we're only querying attended practices
      absentees: []
    })) || [];

    setPractices(practicesData);
  };

  const fetchPlayerMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching matches:', error);
      return;
    }

    setMatches(data?.filter(match => 
      match.players.some(p => p.playerId === id)
    ) || []);
  };

  const getPracticeAttendanceByMonth = () => {
    const monthlyData: { [key: string]: { total: number; attended: number } } = {};
    
    practices.forEach(practice => {
      const month = new Date(practice.date).toLocaleString('default', { month: 'short', year: '2-digit' });
      if (!monthlyData[month]) {
        monthlyData[month] = { total: 0, attended: 0 };
      }
      monthlyData[month].total++;
      monthlyData[month].attended++;
    });

    return Object.entries(monthlyData).map(([month, data]) => ({
      month,
      attendance: (data.attended / data.total) * 100,
    }));
  };

  const getMatchStatistics = () => {
    const stats = {
      totalMatches: matches.length,
      totalMinutes: 0,
      averageMinutes: 0,
      substitutions: 0,
    };

    matches.forEach(match => {
      const playerParticipation = match.players.find(p => p.playerId === id);
      if (playerParticipation) {
        stats.totalMinutes += playerParticipation.minutesPlayed;
        if (playerParticipation.substitutionTime) {
          stats.substitutions++;
        }
      }
    });

    stats.averageMinutes = stats.totalMatches ? Math.round(stats.totalMinutes / stats.totalMatches) : 0;

    return stats;
  };

  if (!player) {
    return <div>Loading...</div>;
  }

  const matchStats = getMatchStatistics();
  const practiceAttendance = getPracticeAttendanceByMonth();

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-6">
          <img
            src={player.profilePhoto || 'https://via.placeholder.com/150'}
            alt={player.fullName}
            className="w-32 h-32 rounded-full object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{player.fullName}</h1>
            <p className="text-gray-500">Born: {formatDate(player.dateOfBirth)}</p>
            <p className="text-gray-500">Health Card Expires: {formatDate(player.healthCardExpiration)}</p>
            <div className="mt-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mr-2">
                {player.goalsScored} Goals Scored
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                {player.goalsAgainst} Goals Against
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Match Statistics</h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Matches</p>
              <p className="text-2xl font-bold">{matchStats.totalMatches}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Avg. Minutes</p>
              <p className="text-2xl font-bold">{matchStats.averageMinutes}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Total Minutes</p>
              <p className="text-2xl font-bold">{matchStats.totalMinutes}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Substitutions</p>
              <p className="text-2xl font-bold">{matchStats.substitutions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Practice Attendance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={practiceAttendance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="attendance"
                  stroke="#4F46E5"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Matches</h2>
          <div className="space-y-4">
            {matches.slice(0, 5).map(match => {
              const participation = match.players.find(p => p.playerId === id);
              return (
                <div key={match.id} className="flex justify-between items-center border-b pb-2">
                  <div>
                    <p className="font-medium">vs {match.rival}</p>
                    <p className="text-sm text-gray-500">{formatDate(match.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{match.result.homeScore} - {match.result.awayScore}</p>
                    <p className="text-sm text-gray-500">
                      {participation?.minutesPlayed} mins
                      {participation?.substitutionTime && ` (Sub: ${participation.substitutionTime}')`}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Practices</h2>
          <div className="space-y-4">
            {practices.slice(0, 5).map(practice => (
              <div key={practice.id} className="flex justify-between items-center border-b pb-2">
                <div>
                  <p className="font-medium">Practice Session</p>
                  <p className="text-sm text-gray-500">{formatDate(practice.date)}</p>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Attended
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}