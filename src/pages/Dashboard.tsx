import React, { useEffect, useState } from 'react';
import { Users, Calendar, Trophy, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Player, Practice, Match } from '../types';
import StatsCard from '../components/dashboard/StatsCard';
import RecentMatches from '../components/dashboard/RecentMatches';
import UpcomingPractices from '../components/dashboard/UpcomingPractices';
import PlayerStats from '../components/dashboard/PlayerStats';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalPlayers: 0,
    totalPractices: 0,
    totalMatches: 0,
    expiringHealthCards: 0,
  });

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    // Fetch players count
    const { count: playersCount } = await supabase
      .from('players')
      .select('*', { count: 'exact' });

    // Fetch practices count
    const { count: practicesCount } = await supabase
      .from('practices')
      .select('*', { count: 'exact' });

    // Fetch matches count
    const { count: matchesCount } = await supabase
      .from('matches')
      .select('*', { count: 'exact' });

    // Fetch players with expiring health cards (within 30 days)
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    const { data: expiringCards } = await supabase
      .from('players')
      .select('id')
      .lt('healthCardExpiration', thirtyDaysFromNow.toISOString())
      .gte('healthCardExpiration', new Date().toISOString());

    setStats({
      totalPlayers: playersCount || 0,
      totalPractices: practicesCount || 0,
      totalMatches: matchesCount || 0,
      expiringHealthCards: expiringCards?.length || 0,
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Players"
          value={stats.totalPlayers}
          icon={<Users className="h-6 w-6" />}
          color="bg-blue-500"
        />
        <StatsCard
          title="Total Practices"
          value={stats.totalPractices}
          icon={<Calendar className="h-6 w-6" />}
          color="bg-green-500"
        />
        <StatsCard
          title="Total Matches"
          value={stats.totalMatches}
          icon={<Trophy className="h-6 w-6" />}
          color="bg-purple-500"
        />
        <StatsCard
          title="Expiring Health Cards"
          value={stats.expiringHealthCards}
          icon={<AlertCircle className="h-6 w-6" />}
          color="bg-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RecentMatches />
        <UpcomingPractices />
      </div>

      <PlayerStats />
    </div>
  );
}