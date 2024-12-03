import { supabase } from '../lib/supabase';
import { Player, PlayerStatistics } from '../types';

export const playerService = {
  async getAll() {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .order('full_name');
    
    if (error) {
      console.error('Error fetching players:', error);
      return [];
    }

    return data?.map(player => ({
      ...player,
      id: player.id,
      fullName: player.full_name,
      profilePhoto: player.profile_photo,
      dateOfBirth: player.date_of_birth,
      healthCardExpiration: player.health_card_expiration,
      goalsScored: player.goals_scored,
      goalsAgainst: player.goals_against,
      position: player.position
    })) || [];
  },

  async search(term: string) {
    const { data, error } = await supabase
      .from('players')
      .select('*')
      .ilike('full_name', `%${term}%`)
      .order('full_name');

    if (error) {
      console.error('Error searching players:', error);
      return [];
    }

    return data?.map(player => ({
      ...player,
      id: player.id,
      fullName: player.full_name,
      profilePhoto: player.profile_photo,
      dateOfBirth: player.date_of_birth,
      healthCardExpiration: player.health_card_expiration,
      goalsScored: player.goals_scored,
      goalsAgainst: player.goals_against,
      position: player.position
    })) || [];
  },

  async create(player: Omit<Player, 'id'>) {
    const { error } = await supabase
      .from('players')
      .insert({
        profile_photo: player.profilePhoto,
        full_name: player.fullName,
        date_of_birth: player.dateOfBirth,
        health_card_expiration: player.healthCardExpiration,
        goals_scored: player.goalsScored,
        goals_against: player.goalsAgainst,
        position: player.position,
      });
    return { error };
  },

  async update(id: string, player: Omit<Player, 'id'>) {
    const { error } = await supabase
      .from('players')
      .update({
        profile_photo: player.profilePhoto,
        full_name: player.fullName,
        date_of_birth: player.dateOfBirth,
        health_card_expiration: player.healthCardExpiration,
        goals_scored: player.goalsScored,
        goals_against: player.goalsAgainst,
        position: player.position,
      })
      .eq('id', id);
    return { error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('players')
      .delete()
      .eq('id', id);
    return { error };
  }
};