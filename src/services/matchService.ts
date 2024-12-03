import { supabase } from '../lib/supabase';
import { Match } from '../types';

export const matchService = {
  async getAll() {
    const { data, error } = await supabase
      .from('matches')
      .select('*')
      .order('date', { ascending: false });
    
    if (error) {
      console.error('Error fetching matches:', error);
      return [];
    }

    return data || [];
  },

  async create(match: Omit<Match, 'id'>) {
    const { error } = await supabase
      .from('matches')
      .insert(match);
    return { error };
  },

  async update(id: string, match: Omit<Match, 'id'>) {
    const { error } = await supabase
      .from('matches')
      .update(match)
      .eq('id', id);
    return { error };
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('matches')
      .delete()
      .eq('id', id);
    return { error };
  }
};